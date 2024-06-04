from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.depends import ProductService, get_product_service, Users, get_admin_user, CategoryService, get_category_service
from app.schemas.product import ProductSchemas
from app.util import add_img

product_route = APIRouter(prefix='/products', tags=['Product'])


@product_route.post('/', status_code=201)
async def create(data: ProductSchemas, service: ProductService = Depends(get_product_service),
                 user: Users = Depends(get_admin_user)):
    product = await service.create(data)
    if not product:
        raise HTTPException(status_code=400)
    return product


@product_route.get('/')
async def all(service: ProductService = Depends(get_product_service)):
    product = await service.all()
    if not product:
        raise HTTPException(status_code=404)
    return product

@product_route.get('/{id}')
async def by_id(id: int, service: ProductService = Depends(get_product_service)):
    product = await service.by_id(id)
    if not product:
        raise HTTPException(status_code=404)
    return product


@product_route.get('/category/')
async def by_category(category_id: int, service: ProductService = Depends(get_product_service)):
    products = await service.by_category(category_id)
    if not products:
        raise HTTPException(status_code=404)
    return products


@product_route.get('/category/{name}')
async def by_name(name: str, 
                     product_service: ProductService = Depends(get_product_service), 
                     category_service: CategoryService = Depends(get_category_service)):
    category = await category_service.by_name(name)
    if not category: raise HTTPException(status_code=404)
    products = await product_service.by_category(category.id)
    if not products: raise HTTPException(status_code=404)
    return products


@product_route.put('/{id}')
async def edit(id: int, data: ProductSchemas, service: ProductService = Depends(get_product_service),
               ):
    product = await service.update(id, data.__dict__)
    if not product:
        raise HTTPException(status_code=400)
    return product


@product_route.patch('/{id}')
async def edit_img(id: int, image: UploadFile = File(...), service: ProductService = Depends(get_product_service),
                   user: Users = Depends(get_admin_user)):
    if image.filename.split('.')[-1] not in ('png', 'jpg', 'svg', 'jpeg'):
        raise HTTPException(status_code=400)
    product = await service.update(id, {'product_img': image.filename})
    if not product:
        raise HTTPException(status_code=400)
    await add_img(image)
    return product


@product_route.delete('/{id}')
async def delete(id: int, service: ProductService = Depends(get_product_service),
                 user: Users = Depends(get_admin_user)):
    result = await service.delete(id)
    if not result:
        raise HTTPException(status_code=409)
    return {'Message': 'Successfuly'}

