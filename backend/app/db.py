import os
import psycopg
from contextlib import asynccontextmanager

#Load the database connection URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

#Define an async context for database connections
@asynccontextmanager
async def get_conn():
    async with await psycopg.AsyncConnection.connect(DATABASE_URL) as conn:
        yield conn
