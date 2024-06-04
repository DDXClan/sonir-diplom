from app.repositories.user import UserRepository, Users
from pydantic import EmailStr
class UserService:

    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def update(self, user: Users, data: dict):
        new_data = {}
        for x in data.keys():
            if data[x]:
                new_data[x] = data[x]
        if not await self.repository.update(user, new_data):
            return None
        return await self.repository.by_email(user.email)
    
    async def delete(self, user: Users):
        if not await self.repository.delete(user):
            return None
        return True
    

    async def all(self):
        return await self.repository.all()
    
    
    async def by_username(self, username: str):
        return await self.repository.by_username(username)
    

    async def by_email(self, email: EmailStr):
        return await self.repository.by_email(email)
    
    
    async def by_id(self, id: int):
        return await self.repository.by_id(id)