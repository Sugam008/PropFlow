import json
import pytest
from unittest.mock import MagicMock, patch
from app.utils.cache import cache_response, invalidate_cache

@pytest.fixture
def mock_redis():
    with patch("app.utils.cache.redis_client") as mock:
        yield mock

def test_cache_response_sync(mock_redis):
    call_count = 0
    
    @cache_response(expire=100, key_prefix="test")
    def my_func(a, b):
        nonlocal call_count
        call_count += 1
        return {"result": a + b}
    
    # First call - cache miss
    mock_redis.get.return_value = None
    res1 = my_func(1, 2)
    assert res1 == {"result": 3}
    assert call_count == 1
    assert mock_redis.setex.called
    
    # Second call - cache hit
    mock_redis.get.return_value = json.dumps({"result": 3})
    res2 = my_func(1, 2)
    assert res2 == {"result": 3}
    assert call_count == 1 # Should not increment

@pytest.mark.asyncio
async def test_cache_response_async(mock_redis):
    call_count = 0
    
    @cache_response(expire=100, key_prefix="test")
    async def my_async_func(a, b):
        nonlocal call_count
        call_count += 1
        return {"result": a + b}
    
    # First call - cache miss
    mock_redis.get.return_value = None
    res1 = await my_async_func(1, 2)
    assert res1 == {"result": 3}
    assert call_count == 1
    
    # Second call - cache hit
    mock_redis.get.return_value = json.dumps({"result": 3})
    res2 = await my_async_func(1, 2)
    assert res2 == {"result": 3}
    assert call_count == 1

def test_invalidate_cache(mock_redis):
    mock_redis.keys.return_value = ["test:key1", "test:key2"]
    invalidate_cache("test:*")
    mock_redis.keys.assert_called_with("test:*")
    mock_redis.delete.assert_called_with("test:key1", "test:key2")
