import './create_product.css'
import { useEffect, useState } from 'react';
import { RefreshToken } from '../api';
import { useNavigate } from 'react-router-dom';
export const CreateProduct = () => {
    const [category, setCategory] = useState([])
    useEffect(() => {
        fetch('http://127.0.0.1:8000/categories', {method: 'GET'})
        .then(res => res.json())
        .then(data => setCategory(data))
        .catch(error => console.log(error))
    }, [])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [categoryID, setCategoryID] = useState('')

    const [product, setProduct] = useState(null)

    const navigate = useNavigate()


    const handleChangeName = (e) => { setName(e.target.value) }

    const handleChangeDescription = (e) => { setDescription(e.target.value) }

    const handleChangePrice = (e) => { setPrice(e.target.value) }

    const handleChangeCategoryID = (e) => { setCategoryID(e.target.value) }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name || !description || !price || !categoryID) { return }
        createProduct()
    }

    const createProduct = () => {
        fetch('http://127.0.0.1:8000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                product_name: name,
                product_description: description,
                price: parseFloat(price),
                category: categoryID
            })
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) { 
                    return RefreshToken().then(createProduct)
                }
                throw new Error('Failed to create product')
            }
            return res.json();
        })
        .then(data => {
            setProduct(data);
            if (data && data.id != null) { navigate(`/products/${data.id}`) }
        })
        .catch(error => console.log(error))
    }
    

    return ( 
        <div className='create-product'>
            <div className='create-product-content'>
            <h1>Создать продукцию</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='name' value={name} onChange={handleChangeName} />
                <textarea placeholder='description' value={description} onChange={handleChangeDescription} />
                <input placeholder='price' type="text" value={price} onChange={handleChangePrice} />
                <select onChange={handleChangeCategoryID}>
                    <option disabled selected>Выберите категорию</option>
                    {category.map(cat => {
                         return <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    })}
                </select>
                <button type='submit'>Создать</button>
            </form>
            </div>
        </div>
     );
}