from fastapi import FastAPI, HTTPException
from app.routes.category import category_route
from app.routes.product import product_route
from app.routes.auth import auth_route
from app.routes.orders import orders_route
from app.routes.users import user_route
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(category_route)

app.include_router(product_route)

app.include_router(auth_route)

app.include_router(user_route)

app.include_router(orders_route)


@app.get('/img/{img_name}')
async def get_img(img_name: str):
    file_path = f'./img/{img_name}'
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="Image not found")