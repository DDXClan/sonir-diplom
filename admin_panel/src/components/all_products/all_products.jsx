import './all_products.css';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
export const AllProducts = () => {
    const [products, setProducts] = useState([]);

    const location = useLocation()

    const currentPath = location.pathname

    const isDelete = () => { return currentPath == '/products/delete' }
    const isUpdate = () => { return currentPath == '/products/update' }
    useEffect(() => {
        fetch('http://127.0.0.1:8000/products', {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(error => console.log(error));
    }, []);
    if(products.length < 1)
        {
            return ( <div className='loading'>Loading...</div>)
        }
    return ( 
        <div className={isDelete() ? 'all-products delete' : (isUpdate() ? 'all-products update' : 'all-products')}>
            <ul>
                {products.map(item => (
                    <Link to={isDelete() ? `/products/delete/${item.id}`: (isUpdate() ? `/products/update/${item.id}` : `/products/${item.id}`)}>
                        <li key={item.id}>
                            <div className='all-products-name-and-id'>
                                <p>{item.id}</p>
                                <p className='all-products-name-product'>{item.product_name}</p>
                            </div>
                            <p className='all-products-price'>{item.price}₽</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </div> 
    );
}