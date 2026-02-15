import asyncio
import functools
import json
import logging
from collections.abc import Callable

from fastapi.encoders import jsonable_encoder

from app.core.redis import redis_client

logger = logging.getLogger(__name__)


def cache_response(expire: int = 600, key_prefix: str = "cache"):
    """
    Decorator to cache function responses in Redis.
    Supports both sync and async functions.
    """

    def decorator(func: Callable):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            cache_key = _gen_key(func, key_prefix, args, kwargs)
            try:
                cached_val = redis_client.get(cache_key)
                if cached_val:
                    logger.debug(f"Cache hit for key: {cache_key}")
                    return json.loads(cached_val)
            except Exception as e:
                logger.warning(f"Redis get error: {e}")

            result = await func(*args, **kwargs)
            _set_cache(cache_key, result, expire)
            return result

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            cache_key = _gen_key(func, key_prefix, args, kwargs)
            try:
                cached_val = redis_client.get(cache_key)
                if cached_val:
                    logger.debug(f"Cache hit for key: {cache_key}")
                    return json.loads(cached_val)
            except Exception as e:
                logger.warning(f"Redis get error: {e}")

            result = func(*args, **kwargs)
            _set_cache(cache_key, result, expire)
            return result

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


def _gen_key(func, key_prefix, args, kwargs):
    filtered_kwargs = {
        k: v for k, v in kwargs.items() if k not in ["db", "current_user"]
    }
    args_str = ":".join([str(a) for a in args])
    kwargs_str = ":".join([f"{k}={v}" for k, v in sorted(filtered_kwargs.items())])
    return f"{key_prefix}:{func.__name__}:{args_str}:{kwargs_str}"


def _set_cache(cache_key, result, expire):
    try:
        serializable_result = jsonable_encoder(result)
        redis_client.setex(
            cache_key, expire, json.dumps(serializable_result, default=str)
        )
        logger.debug(f"Cached result for key: {cache_key}")
    except Exception as e:
        logger.warning(f"Redis set error: {e}")


def invalidate_cache(key_pattern: str):
    """
    Invalidate cache keys matching a pattern.
    """
    try:
        keys = redis_client.keys(key_pattern)
        if keys:
            redis_client.delete(*keys)
            logger.info(f"Invalidated {len(keys)} keys with pattern: {key_pattern}")
    except Exception as e:
        logger.warning(f"Redis delete error: {e}")
