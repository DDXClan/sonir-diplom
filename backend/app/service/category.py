from app.repositories.category import CategoryRepository
from app.schemas.category import CategorySchemas

class CategoryService:
    
    def __init__(self, repository: CategoryRepository) -> None:
        self.repository = repository


    async def create(self, data: CategorySchemas):
        return await self.repository.create(data.__dict__)
    

    async def all(self):
        return await self.repository.all()
    

    async def update(self, id: int, data: dict):
        category = await self.repository.by_id(id)
        new_data = {}
        for x in data.keys(): 
            if data[x]:
                new_data[x] = data[x]
        if not category or not await self.repository.update(category, new_data):
            return None
        return await self.repository.by_id(id)
    

    async def delete(self, id: int):
        category = await self.repository.by_id(id)
        if not category or not await self.repository.delete(category):
            return None
        return True
    
    async def by_name(self, name: str):
        return await self.repository.by_name(name)
        