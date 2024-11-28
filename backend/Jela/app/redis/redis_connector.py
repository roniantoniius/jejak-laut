import os
from dotenv import load_dotenv
import redis.asyncio as redis

load_dotenv()

class RedisTokenManager:
    def __init__(self):
        """Initialize connection parameters from environment variables"""
        self.REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
        self.REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
        self.REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', None)
        self.REDIS_USER = os.getenv('REDIS_USER', None)
        self.connection = None

    async def create_connection(self):
        """Creates an asynchronous connection to Redis if not already created."""
        if self.connection is None:  # Pastikan koneksi dibuat hanya jika belum ada
            self.connection = redis.Redis(
                host=self.REDIS_HOST,
                port=self.REDIS_PORT,
                password=self.REDIS_PASSWORD,
                username=self.REDIS_USER,
                decode_responses=True
            )
        return self.connection

    async def set_token(self, key, value, expiration):
        """Set a token in Redis with expiration time."""
        connection = await self.create_connection()  # Pastikan koneksi Redis sudah ada
        await connection.setex(key, expiration, value)

    async def get_token(self, key):
        """Get a token value from Redis."""
        connection = await self.create_connection()
        return await connection.get(key)

    async def delete_token(self, key):
        """Delete a token from Redis."""
        connection = await self.create_connection()
        await connection.delete(key)
