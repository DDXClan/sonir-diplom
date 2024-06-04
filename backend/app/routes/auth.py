from fastapi import APIRouter, Depends, HTTPException, Form, Body
from app.depends import AuthService, get_auth_service, get_current_user, Users
from app.schemas.user import UserSchemas, EmailStr, Refrash_token


auth_route = APIRouter(prefix='/auth', tags=['Authentication '])


@auth_route.post('/registration', status_code=201)
async def registraion(data: UserSchemas, service: AuthService = Depends(get_auth_service)):
    user = await service.registration(data)
    if not user:
        raise HTTPException(status_code=400)
    return user


@auth_route.post('/login')
async def login(email: EmailStr = Form(...), password: str = Form(...), 
                service: AuthService = Depends(get_auth_service)):
    content = await service.login(email, password)
    if not content:
        raise HTTPException(status_code=400)
    return content


@auth_route.patch('/refresh')
async def refresg_token(data: Refrash_token, 
                        service: AuthService = Depends(get_auth_service)):
    content = await service.refrash_access_token(data.refresh_token)
    if not content:
        raise HTTPException(status_code=401)
    return content


@auth_route.delete('/exit')
async def exit(user: Users = Depends(get_current_user), 
               service: AuthService = Depends(get_auth_service)):
    if not await service.exit(user):
        raise HTTPException(status_code=400)
    return {'message': 'Successfuly'}


