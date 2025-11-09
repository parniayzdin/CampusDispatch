import os
import psycopg
from contextlib import asynccontextmanager

DATABASE_URL = os.getenv("DATABASE_URL")

@asynccontextmanager
async def get_conn():
    async with await psycopg.AsyncConnection.connect(DATABASE_URL) as conn:
        yield conn
