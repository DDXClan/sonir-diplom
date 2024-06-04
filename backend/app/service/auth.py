from app.repositories.user import UserRepository, Users
from app.schemas.user import UserSchemas, EmailStr
from passlib.hash import pbkdf2_sha256
from datetime import timedelta, datetime
import jwt
import typing
class AuthService:

    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository
        self.SECRET_KEY = '455b7bf5dcbc87e3b0a1c02ccce51614c56175ef378d05e8c18a4ac7c5170d98'


    async def registration(self, data: UserSchemas):
        data.password = pbkdf2_sha256.hash(data.password)
        return await self.repository.create(data.__dict__)
    

    async def verify_password(self, password: str, hash_password: str):
        return pbkdf2_sha256.verify(password, hash_password)


    async def create_jwt_token(self, email: EmailStr):
        access_token = jwt.encode({'sub': email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, self.SECRET_KEY, algorithm='HS256')
        refresh_token = jwt.encode({'sub': email, 'exp': datetime.utcnow() + timedelta(days=7)}, self.SECRET_KEY, algorithm='HS256')
        return access_token, refresh_token


    async def login(self, email: EmailStr, password: str):
        user = await self.repository.by_email(email)
        if not user or not await self.verify_password(password, user.password):
            return None
        access_token, refrash_token = await self.create_jwt_token(user.email)
        send_ref_token_db = await self.repository.update(user, {'update_token': refrash_token})
        if not send_ref_token_db:
            return None
        return {'type': 'bearer', 'access_token': access_token, 'refresh_token': refrash_token, 'role': user.role}
        
    


    async def verify_access_token(self, token: str) -> typing.Optional[Users]:
        try:
            decode_data = jwt.decode(token, self.SECRET_KEY, 'HS256')
            user = await self.repository.by_email(decode_data['sub'])
            if not token:
                return None
            return user
        except jwt.PyJWTError:
            return None


    async def refrash_access_token(self, refrash_token: str):
        user = await self.repository.by_token(refrash_token)
        if not user:
            return None
        access_token, refrash_token = await self.create_jwt_token(user.email)
        send_ref_token_db = await self.repository.update(user, {'update_token': refrash_token})
        if not send_ref_token_db:
            return None
        return {'type': 'bearer', 'access_token': access_token, 'refresh_token': refrash_token}


    async def exit(self, user: Users):
        if not await self.repository.update(user, {'update_token': None}):
            return None
        return True