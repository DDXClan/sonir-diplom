from app.database.connect import operation_session, AsyncSession
from app.database.models import Category
import typing
from sqlalchemy import select, update

class CategoryRepository:


    async def create(self, data: dict) -> typing.Optional[Category]:
        async def op(session: AsyncSession):
            category = Category(**data)
            session.add(category)
            await session.commit()
            return category
        return await operation_session(op)
    

    async def all(self) -> typing.List[Category]:
        async def op(session: AsyncSession):
            categories = await session.execute(select(Category).order_by(Category.id))
            return categories.scalars().all()
        return await operation_session(op)
    

    async def by_id(self, id: int) -> typing.Optional[Category]:
        async def op(session: AsyncSession):
            category = await session.execute(select(Category).where(Category.id == id))
            return category.scalar_one_or_none()
        return await operation_session(op)
    

    async def update(self, category: Category, data: dict) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.execute(update(Category).where(Category.id == category.id).values(**data))
            await session.commit()
            return True
        return await operation_session(op)
    

    async def delete(self, category: Category) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.delete(category)
            await session.commit()
            return True
        return await operation_session(op)
    
    async def by_name(self, name: str) -> typing.Optional[Category]:
        async def op(session: AsyncSession):
            category = await session.execute(select(Category).where(Category.category_name == name))
            return category.scalar_one_or_none()
        return await operation_session(op)
    
