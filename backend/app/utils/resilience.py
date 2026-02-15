import asyncio
import functools
import logging
from collections.abc import Callable

logger = logging.getLogger(__name__)


def async_retry(
    retries: int = 3,
    backoff_in_seconds: float = 1.0,
    exceptions: type[Exception] | tuple[type[Exception], ...] = Exception,
):
    """
    Async retry decorator with exponential backoff.
    """

    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            attempt = 0
            while attempt < retries:
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    attempt += 1
                    if attempt == retries:
                        logger.error(
                            "Max retries reached for %s. Error: %s",
                            func.__name__,
                            str(e),
                        )
                        raise

                    wait_time = backoff_in_seconds * (2 ** (attempt - 1))
                    logger.warning(
                        "Attempt %d failed for %s, retrying in %.2f seconds... "
                        "Error: %s",
                        attempt,
                        func.__name__,
                        wait_time,
                        str(e),
                    )
                    await asyncio.sleep(wait_time)
            return await func(*args, **kwargs)

        return wrapper

    return decorator
