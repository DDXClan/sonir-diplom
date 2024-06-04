import './delete_product.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RefreshToken } from '../api';

export const DeleteProduct = () => {
    const { id } = useParams()

    const [product, setProduct] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${id}`, { method: 'GET' })
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(error => console.log(error))
    }, [])

    if(!product) { return <div className='loading'>Loading...</div>}

    const deleteProduct = () =>
    {
        fetch(`http://127.0.0.1:8000/products/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
        .then(res => {
            if(!res.ok) { if(res.status === 401) {return RefreshToken().then(deleteProduct)} throw new Error('Failed to delete product') }
            if(res.ok) { navigate('/products/delete') }
        })
        .catch(error => console.log(error))
    }

    return ( 
        <div className='delete-product-menu'>
            <div className='delete-product-menu-content'>
                <div>
                <h2>Вы уверены что хотите удалить {product.product_name}?</h2>
                </div>
                <div className='delete-product-menu-change'>
                    <p onClick={deleteProduct}>Да</p>
                    <p onClick={() => {navigate('/products/delete')}}>Нет</p>
                </div>
            </div>
        </div>
     );
}