from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.depends import get_category_service, CategoryService, Users, get_admin_user
from app.schemas.category import CategorySchemas
from app.util import add_img

category_route = APIRouter(prefix='/categories', tags=['Category'])


@category_route.post('/', status_code=201)
async def create(data: CategorySchemas, service: CategoryService = Depends(get_category_service),
                 user: Users = Depends(get_admin_user)):
    category = await service.create(data)
    if not category: 
        raise HTTPException(400)
    return category


@category_route.get('/')
async def all(service: CategoryService = Depends(get_category_service)):
    categories = await service.all()
    if not categories:
        raise HTTPException(status_code=404)
    return categories


@category_route.put('/{id}')
async def edit(id: int, data: CategorySchemas, 
               service: CategoryService = Depends(get_category_service),
               user: Users = Depends(get_admin_user)):
    category = await service.update(id, data.__dict__)
    if not category:
        raise HTTPException(status_code=400)
    return category


@category_route.patch('/{id}')
async def edit_img(id: int, image: UploadFile = File(...), 
                   service: CategoryService = Depends(get_category_service),
                   user: Users = Depends(get_admin_user)):
    if image.filename.split('.')[-1] not in ('png', 'jpg', 'svg', 'jpeg'):
        raise HTTPException(status_code=400)
    category = await service.update(id, {'category_img': image.filename})
    if not category:
        raise HTTPException(status_code=400)
    await add_img(image)
    return category


@category_route.delete('/{id}')
async def delete(id: int, service: CategoryService = Depends(get_category_service),
                 user: Users = Depends(get_admin_user)):
    result = await service.delete(id)
    if not result:
        raise HTTPException(status_code=409)
    return {'Message': 'Successfuly'}