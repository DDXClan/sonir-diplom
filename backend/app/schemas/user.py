from pydantic import BaseModel, EmailStr, field_validator
from fastapi import HTTPException
import typing
from datetime import date 


class UserSchemas(BaseModel):
    username: typing.Optional[str] = None
    email: typing.Optional[EmailStr] = None
    password: typing.Optional[str] = None
    gender: typing.Optional[str] = None
    date_birth: typing.Optional[date] = None

    @field_validator('password')
    @classmethod
    def check_lenght(cls, value: str) -> str:
        if len(value) < 6:
            raise ValueError('The password is too meek')
        return value
    

class Refrash_token(BaseModel):
    refresh_token: str