from pydantic import BaseModel
import typing


class ProductSchemas(BaseModel):
    product_name: typing.Optional[str] = None
    product_description: typing.Optional[str] = None
    price: typing.Optional[float] = None
    category: typing.Optional[int] = None


class ProductCharacteristic(BaseModel):
    characteristic_name: typing.Optional[str] = None
    characteristic_value: typing.Optional[str] = None