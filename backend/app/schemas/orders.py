from pydantic import BaseModel
import typing

class OrdersSchemas(BaseModel):
    address: typing.Optional[str] = None
    product_id: typing.Optional[int] = None


class OrderUpdateStatus(BaseModel):
    status: str