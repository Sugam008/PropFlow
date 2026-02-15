import asyncio
import pytest
from app.utils.resilience import async_retry

@pytest.mark.asyncio
async def test_async_retry_success():
    call_count = 0
    
    @async_retry(retries=3, backoff_in_seconds=0.1)
    async def success_func():
        nonlocal call_count
        call_count += 1
        return "success"
        
    result = await success_func()
    assert result == "success"
    assert call_count == 1

@pytest.mark.asyncio
async def test_async_retry_fails_then_succeeds():
    call_count = 0
    
    @async_retry(retries=3, backoff_in_seconds=0.1)
    async def retry_func():
        nonlocal call_count
        call_count += 1
        if call_count < 2:
            raise ValueError("First attempt fails")
        return "success"
        
    result = await retry_func()
    assert result == "success"
    assert call_count == 2

@pytest.mark.asyncio
async def test_async_retry_max_retries_reached():
    call_count = 0
    
    @async_retry(retries=2, backoff_in_seconds=0.1)
    async def fail_func():
        nonlocal call_count
        call_count += 1
        raise ValueError("Always fails")
        
    with pytest.raises(ValueError, match="Always fails"):
        await fail_func()
    assert call_count == 2
