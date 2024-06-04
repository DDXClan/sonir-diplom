from app.database.connect import operation_session, AsyncSession
from app.database.models import Users
import typing
from sqlalchemy import select, update


class UserRepository:

    async def create(self, data: dict) -> typing.Optional[Users]:
        async def op(session: AsyncSession):
            user = Users(**data)
            session.add(user)
            await session.commit()
            return user
        return await operation_session(op)
    

    async def all(self) -> typing.List[Users]:
        async def op(session: AsyncSession):
            users = await session.execute(select(Users))
            return users.scalars().all()
        return await operation_session(op)


    async def by_id(self, id: int) -> typing.Optional[Users]:
        async def op(session: AsyncSession):
            user = await session.execute(select(Users).where(Users.id == id))
            return user.scalar_one_or_none()
        return await operation_session(op)
    

    async def by_username(self, username: str) -> typing.Optional[Users]:
        async def op(session: AsyncSession):
            user = await session.execute(select(Users).where(Users.username == username))
            return user.scalar_one_or_none()
        return await operation_session(op)


    async def by_email(self, email: str) -> typing.Optional[Users]:
        async def op(session: AsyncSession):
            user = await session.execute(select(Users).where(Users.email == email))
            return user.scalar_one_or_none()
        return await operation_session(op)


    async def by_token(slef, token: str) -> typing.Optional[Users]:
        async def op(session: AsyncSession):
            user = await session.execute(select(Users).where(Users.update_token == token))
            return user.scalar_one_or_none()
        return await operation_session(op)


    async def update(self, user: Users, data: dict) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.execute(update(Users).where(Users.id == user.id).values(**data))
            await session.commit()
            return True
        return await operation_session(op)
    

    async def delete(self, user: Users) -> typing.Optional[True]:
        async def op(session: AsyncSession):
            await session.delete(user)
            await session.commit()
            return True
        return await operation_session(op)
    