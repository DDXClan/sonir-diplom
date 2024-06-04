from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.depends import (UserService, get_user_service, get_current_user, 
                         Users, get_auth_service, AuthService)
from app.schemas.user import UserSchemas
from app.util import add_img
user_route = APIRouter(prefix='/user', tags=['User'])

@user_route.get('/me')
async def me(user: Users = Depends(get_current_user)):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'geneder': user.gender,
        'date_birth': user.date_birth,
        'profile_img': user.profile_img
    }


@user_route.put('/')
async def edit(data: UserSchemas, service: UserService = Depends(get_user_service),
               auth_service: AuthService = Depends(get_auth_service),
               user: Users = Depends(get_current_user), password: str = Form(...)):
    if not await auth_service.verify_password(password, user.password):
        raise HTTPException(status_code=403)
    update_data = await service.update(user, data.__dict__)
    if not update_data:
        raise HTTPException(status_code=409)
    return {'message': 'Successfuly'}


@user_route.patch('/')
async def upadte_image(image: UploadFile = File(...), service: UserService = Depends(get_user_service),
                       user: UserService = Depends(get_current_user)):
    if image.filename.split('.')[-1] not in ('png', 'jpg', 'svg', 'jpeg'):
        raise HTTPException(status_code=400)
    update_data = await service.update(user, {'profile_img': image.filename})
    if not update_data:
        raise HTTPException(status_code=400)
    await add_img(image)
    return {'message': 'Successfuly'}


@user_route.delete('/')
async def delete(password: str = Form(...), 
                 serivce: UserService = Depends(get_user_service), 
                 auth_service: AuthService = Depends(get_auth_service),
                 user: Users = Depends(get_current_user)):
    if not await auth_service.verify_password(password, user.password):
        raise HTTPException(status_code=403)
    return {'message': 'Successfuly'}