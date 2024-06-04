import './update_product.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshToken } from '../api';

export const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryID, setCategoryID] = useState('');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${id}`, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setName(data.product_name);
                setDescription(data.product_description);
                setPrice(data.price);
                setCategoryID(data.category);
            })
            .catch(error => console.log(error));
    }, [id]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/categories', { method: 'GET' })
            .then(res => res.json())
            .then(data => setCategory(data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        const dropContainer = document.getElementById("dropcontainer");
        const fileInput = document.getElementById("images");

        if (dropContainer && fileInput) {
            dropContainer.addEventListener("dragover", (e) => {
                e.preventDefault();
            }, false);

            dropContainer.addEventListener("dragenter", () => {
                dropContainer.classList.add("drag-active");
            });

            dropContainer.addEventListener("dragleave", () => {
                dropContainer.classList.remove("drag-active");
            });

            dropContainer.addEventListener("drop", (e) => {
                e.preventDefault();
                dropContainer.classList.remove("drag-active");
                fileInput.files = e.dataTransfer.files;
            });

            return () => {
                dropContainer.removeEventListener("dragover", () => {});
                dropContainer.removeEventListener("dragenter", () => {});
                dropContainer.removeEventListener("dragleave", () => {});
                dropContainer.removeEventListener("drop", () => {});
            };
        }
    }, []);

    if (!product || category.length === 0) {
        return (<div className='loading'>Loading...</div>);
    }

    const handleChangeName = (e) => { setName(e.target.value) }
    const handleChangeDescription = (e) => { setDescription(e.target.value) }
    const handleChangePrice = (e) => { setPrice(e.target.value) }
    const handleChangeCategoryID = (e) => { setCategoryID(e.target.value) }

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {};
        if (name) { body['product_name'] = name; }
        if (description) { body['product_description'] = description; }
        if (price) { body['price'] = parseFloat(price); }
        if (categoryID) { body['category'] = categoryID; }
        updateProduct(body);
    }

    const updateProduct = (body) => {
        fetch(`http://127.0.0.1:8000/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: JSON.stringify(body)
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    return RefreshToken().then(() => updateProduct(body));
                }
                throw new Error('Failed to update product');
            }
            return res.json();
        })
        .then(() => {
            navigate(`/products/${id}`);
        })
        .catch(error => console.log(error));
    }

    const handleImageSubmit = (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("images");
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        fetch(`http://127.0.0.1:8000/products/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    return RefreshToken().then(() => handleImageSubmit(e));
                }
                throw new Error('Failed to update product image');
            }
            return res.json();
        })
        .then(() => {
            navigate(`/products/${id}`);
        })
        .catch(error => console.log(error));
    }

    return (
        <div className="update-product">
            <div className='update-product-content'>
                <h1>Изменить "{product.product_name}"</h1>
                <form onSubmit={handleSubmit} className='update-product-info'>
                    <input
                        type="text"
                        placeholder='name'
                        value={name}
                        onChange={handleChangeName}
                    />
                    <textarea
                        placeholder='description'
                        value={description}
                        onChange={handleChangeDescription}
                    />
                    <input
                        placeholder='price'
                        type="text"
                        value={price}
                        onChange={handleChangePrice}
                    />
                    <select value={categoryID} onChange={handleChangeCategoryID}>
                        <option disabled value="">Выберите категорию</option>
                        {category.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                        ))}
                    </select>
                    <button type='submit'>Изменить</button>
                </form>
                <form className='update-product-img' onSubmit={handleImageSubmit}>
                    <h1>Изменить фотографию</h1>
                    <label htmlFor="images" className="drop-container" id="dropcontainer">
                        <span className="drop-title">Drop files here</span>
                        or
                        <input type="file" id="images" accept="image/*" required />
                    </label>
                    <button type='submit'>Изменить</button>
                </form>
            </div>
        </div>
    );
}
