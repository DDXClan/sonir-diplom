from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

async_engine = create_async_engine('')

async_session = sessionmaker(async_engine, class_ = AsyncSession, expire_on_commit=False)

async def operation_session(func):
    async with async_session() as session:
        try:
            result = await func(session)
            return result
        except:
            return None