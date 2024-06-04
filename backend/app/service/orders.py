from app.repositories.orders import OrdersRepository, Orders
from app.schemas.orders import OrdersSchemas
from app.database.models import Users
import typing
class OrdersService:

    def __init__(self, repository: OrdersRepository) -> None:
        self.repository = repository

    
    async def create(self,user: Users, data: OrdersSchemas) -> typing.Optional[Orders]:
        data = data.__dict__
        data['user_id'] = user.id
        return await self.repository.create(data)
        

    async def all(self) -> typing.List[Orders]:
        return await self.repository.all()
    

    async def by_id(self, order_id: int) -> typing.Optional[Orders]:
        return await self.repository.by_id(order_id)

    async def by_user(self, user_id: int) -> typing.Optional[Orders]:
        return await self.repository.by_user(user_id)
    
    
    async def update_status(self, id: int, status: str) -> typing.Optional[Orders]:
        order = await self.repository.by_id(id)
        if not order or not await self.repository.update(order, {'status': status}):
            return None
        return await self.repository.by_id(id)
