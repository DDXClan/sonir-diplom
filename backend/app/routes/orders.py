from fastapi import APIRouter, Depends, HTTPException
from app.schemas.orders import OrdersSchemas, OrderUpdateStatus
from app.depends import (OrdersService, get_orders_service, UserService, 
                         get_user_service, get_current_user, Users, 
                         get_product_service, ProductService, get_admin_user)
from app.util import send_mail

orders_route = APIRouter(prefix='/orders', tags=['Orders'])


@orders_route.post('/', status_code=201)
async def create(data: OrdersSchemas,
                 order_service: OrdersService = Depends(get_orders_service),
                 user_service: UserService = Depends(get_user_service),
                 product_service: ProductService = Depends(get_product_service),
                 user: Users = Depends(get_current_user)):
    order = await order_service.create(user, data)
    if not order:
        raise HTTPException(status_code=400)
    mail_result = await send_mail(user.email, 
                            subject='Ваш заказ был отправлен в рассмотрение', 
                            message='Добрый день, ваш заказ был оправлен на рассмотрение. \
                                     Мы скоро свяжемся с вами')
    detail = 'check your email'
    if not mail_result:
        detail = 'message was not sent to the mailmessage from email'
    user = await user_service.by_id(order.user_id)
    product = await product_service.by_id(order.product_id)
    order_response = {'id': order.id,
                      'address': order.address,
                      'status': order.status,
                      'product': {
                          'id': product.id,
                          'name': product.product_name,
                          'img': product.product_img,
                          'description': product.product_description,
                          'price': product.price,
                      },
                      'user': {
                          'username': user.username,
                          'email': user.email,
                      },
                      'detail': detail
                      }
    return order_response

@orders_route.get('/me')
async def my_orders(user: Users = Depends(get_current_user), 
                    order_service: OrdersService = Depends(get_orders_service),
                    product_service: ProductService = Depends(get_product_service)):
    order = await order_service.by_user(user.id)
    if not order:
        raise HTTPException(status_code=400)
    orders = list()
    for ord in order:
        product = await product_service.by_id(ord.product_id)
        orders.append({'id': ord.id,
                      'address': ord.address,
                      'status': ord.status,
                      'product': {
                          'id': product.id,
                          'name': product.product_name,
                          'img': product.product_img,
                          'description': product.product_description,
                          'price': product.price,
                      }
                      })
    return orders

@orders_route.get('/')
async def all(order_service: OrdersService = Depends(get_orders_service),
              product_service: ProductService = Depends(get_product_service),
              user_service: UserService = Depends(get_user_service),
              admin: Users = Depends(get_admin_user)):
    order = await order_service.all()
    if not order:
        raise HTTPException(status_code=400)
    orders = list()
    for ord in order:
        product = await product_service.by_id(ord.product_id)
        user = await user_service.by_id(ord.user_id)
        orders.append({'id': ord.id,
                      'address': ord.address,
                      'status': ord.status,
                      'product': {
                          'id': product.id,
                          'name': product.product_name,
                          'img': product.product_img,
                          'description': product.product_description,
                          'price': product.price,
                      },
                      'user': {
                          'username': user.username if user else ord.user_id,
                          'email': user.email if user else 'not found',
                      },
                      })
    return orders

@orders_route.get('/user/')
async def by_email(email: str, 
                   order_service: OrdersService = Depends(get_orders_service),
                   user_service: UserService = Depends(get_user_service),
                   product_service: ProductService = Depends(get_product_service),
                   admin: Users = Depends(get_admin_user)):
    user = await user_service.by_email(email)
    if not user:
        raise HTTPException(status_code=404)
    order = await order_service.by_user(user.id)
    if not order:
        raise HTTPException(status_code=400)
    orders = list()
    for ord in order:
        product = await product_service.by_id(ord.product_id)
        orders.append({'id': ord.id,
                      'address': ord.address,
                      'status': ord.status,
                      'product': {
                          'id': product.id,
                          'name': product.product_name,
                          'img': product.product_img,
                          'description': product.product_description,
                          'price': product.price,
                      }
                      })
    return orders

@orders_route.patch('/{id}')
async def update_status(id: int, data: OrderUpdateStatus, 
                   order_service: OrdersService = Depends(get_orders_service),
                   user_service: UserService = Depends(get_user_service),
                   product_service: ProductService = Depends(get_product_service),
                   admin: Users = Depends(get_admin_user)):
    order = await order_service.update_status(id, data.status)
    if not order:
        return HTTPException(status_code=400)
    product = await product_service.by_id(order.product_id)
    user = await user_service.by_id(order.user_id)
    await send_mail(user.email, 'Изменение статуса заказа', f'Статус вашего заказа был изменен на {data.status}')
    return {'id': order.id,
                    'address': order.address,
                    'status': order.status,
                    'product': {
                        'id': product.id,
                        'name': product.product_name,
                        'img': product.product_img,
                        'description': product.product_description,
                        'price': product.price,
                    },
                    'user': {
                        'username': user.username if user else order.user_id,
                        'email': user.email if user else 'not found',
                    },
                    }
