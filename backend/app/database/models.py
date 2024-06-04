from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, DATE, ForeignKey, TEXT, Float


Base = declarative_base()


class Users(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255))
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    gender = Column(String(255), default='unknown')
    profile_img = Column(String(500), default='placeholder.png')
    date_birth = Column(DATE, default=None)
    update_token = Column(String, unique=True)
    role = Column(String, default='user')


class Category(Base):
    __tablename__ = "Category"
    id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(255), nullable=False, unique=True)
    category_description = Column(TEXT)
    category_img = Column(String(500), default='placeholder.png')
    product = relationship('Product', cascade='all, delete')


class Product(Base):
    __tablename__ = 'Product'
    id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String(255), nullable=False)
    product_img = Column(String(500), default='placeholder.png')
    product_description = Column(TEXT)
    price = Column(Float, default=0.0)
    category = Column(ForeignKey(Category.id), nullable=False)


class Orders(Base):
    __tablename__ = 'Ordres'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(ForeignKey(Users.id), nullable=False)
    address = Column(String(255), nullable=False)
    product_id = Column(ForeignKey(Product.id), nullable=False)
    status = Column(String, default='reviewing')