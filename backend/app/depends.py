from app.service.category import CategoryRepository, CategoryService
from app.service.product import ProductRepository, ProductService
from app.service.auth import UserRepository, AuthService, Users
from app.service.orders import OrdersRepository, OrdersService
from app.service.user import UserService
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
import typing


category_repository = CategoryRepository()

category_service = CategoryService(category_repository)

async def get_category_service() -> CategoryService:
    return category_service


product_repository = ProductRepository()

prodcut_service = ProductService(product_repository)

async def get_product_service() -> ProductRepository:
    return prodcut_service


user_repository = UserRepository()

auth_service = AuthService(user_repository)

async def get_auth_service() -> AuthService:
    return auth_service

oauth2scheme = OAuth2PasswordBearer('/auth/login')

async def get_current_user(token: str = Depends(oauth2scheme)) -> typing.Optional[Users]:
    user = await auth_service.verify_access_token(token)
    if not user:
        raise HTTPException(status_code=401)
    return user

async def get_admin_user(token: str = Depends(oauth2scheme)) -> typing.Optional[Users]:
    user = await auth_service.verify_access_token(token)
    if not user:
        raise HTTPException(status_code=401)
    if not user.role == 'admin':
        raise HTTPException(status_code=403)
    return user


user_service = UserService(user_repository)

async def get_user_service() -> UserService:
    return user_service


order_repository = OrdersRepository()

order_service = OrdersService(order_repository)

async def get_orders_service() -> OrdersService:
    return order_service