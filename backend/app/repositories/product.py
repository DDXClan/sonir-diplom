from app.database.connect import operation_session, AsyncSession
from app.database.models import Product
import typing
from sqlalchemy import select, update, delete

class ProductRepository:


    async def create(self, data: dict) -> typing.Optional[Product]:
        async def op(session: AsyncSession):
            product = Product(**data)
            session.add(product)
            await session.commit()
            return product
        return await operation_session(op)
    

    async def all(self) -> typing.List[Product]:
        async def op(session: AsyncSession):
            products = await session.execute(select(Product).order_by(Product.id))
            return products.scalars().all()
        return await operation_session(op)
    

    async def by_id(self, id: int) -> typing.Optional[Product]:
        async def op(session: AsyncSession):
            product = await session.execute(select(Product).where(Product.id == id))
            return product.scalar_one_or_none()
        return await operation_session(op)
    

    async def by_category(self, category_id: int) -> typing.List[Product]:
        async def op(session: AsyncSession):
            products = await session.execute(select(Product).where(Product.category == category_id))
            return products.scalars().all()
        return await operation_session(op)


    async def update(self, product: Product, data: dict) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.execute(update(Product).where(Product.id == product.id).values(**data))
            await session.commit()
            return True
        return await operation_session(op)
    

    async def delete(self, product: Product) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.delete(product)
            await session.commit()
            return True
        return await operation_session(op)
    
    