import redis.asyncio as redis
import asyncio

async def test_redis_connection():
    try:
        connection = redis.Redis(
            host="localhost",  # Atau gunakan 127.0.0.1
            port=6380,
            password="Theo@2804",
            username="default",
            decode_responses=True
        )
        pong = await connection.ping()
        print(f"Redis Connection: {pong}")
    except Exception as e:
        print(f"Failed to connect to Redis: {e}")
    finally:
        if 'connection' in locals():
            await connection.close()

asyncio.run(test_redis_connection())
