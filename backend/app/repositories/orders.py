from app.database.models import Orders
from app.database.connect import operation_session
import typing
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
class OrdersRepository:

    async def create(self, data: dict) -> typing.Optional[Orders]:
        async def op(session: AsyncSession):
            order = Orders(**data)
            session.add(order)
            await session.commit()
            return order
        return await operation_session(op)
    

    async def all(self) -> typing.List[Orders]:
        async def op(session: AsyncSession):
            categories = await session.execute(select(Orders))
            return categories.scalars().all()
        return await operation_session(op)
    

    async def by_id(self, id: int) -> typing.Optional[Orders]:
        async def op(session: AsyncSession):
            category = await session.execute(select(Orders).where(Orders.id == id))
            return category.scalar_one_or_none()
        return await operation_session(op)
    

    async def update(self, order: Orders, data: dict) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.execute(update(Orders).where(Orders.id == order.id).values(**data))
            await session.commit()
            return True
        return await operation_session(op)
    

    async def delete(self, order: Orders) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.delete(order)
            await session.commit()
            return True
        return await operation_session(op)
    
    async def by_user(self, user_id: int) -> typing.List[Orders]:
        async def op(session: AsyncSession):
            orders = await session.execute(select(Orders).where(Orders.user_id == user_id))
            return orders.scalars().all()
        return await operation_session(op)