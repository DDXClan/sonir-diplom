import './product.css'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Product = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${id}`, {method: 'GET'})
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(error => console.log(error))
    }, [])

    if(!product) 
    {
        return (<div className='loading'>Loading...</div>)
    }
    return ( 
    <div className="product">
        <h2>{product.product_name}</h2>
            <div className='product-info'>
                <img className='product-img' src={`http://127.0.0.1:8000/img/${product.product_img}`} alt='product image' />
                <div className='product-info-description-and-price'>
                    <p className='product-info-description'>{product.product_description}</p>
                    <p className='product-info-price'>{product.price}₽</p>
                </div>
        </div>
    </div> 
    );
}