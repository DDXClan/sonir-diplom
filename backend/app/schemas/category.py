from pydantic import BaseModel
import typing

class CategorySchemas(BaseModel): 
    category_name: typing.Optional[str] = None
    category_description: typing.Optional[str] = None