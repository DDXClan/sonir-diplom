from app.repositories.product import ProductRepository
from app.schemas.product import ProductSchemas

class ProductService:

    def __init__(self, repository: ProductRepository) -> None:
        self.repository = repository

    
    async def create(self, data: ProductSchemas):
        return await self.repository.create(data.__dict__)
    
    async def all(self):
        return await self.repository.all()
    
    async def by_id(self, id: int):
        return await self.repository.by_id(id)
    
    async def by_category(self, category_id: int):
        return await self.repository.by_category(category_id)

    async def update(self, id: int, data:dict):
        product = await self.repository.by_id(id)
        new_data = {}
        for x in data.keys():
            if data[x]:
                new_data[x] = data[x]
        if not product or not await self.repository.update(product, new_data):
            return None
        return await self.repository.by_id(id)
    
    async def delete(self, id: int):
        product = await self.repository.by_id(id)
        if not product or not await self.repository.delete(product):
            return None
        return True