import { RefreshToken } from '../api';
import './categories.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export const Categories = () => {
    const [categories, setCategories] = useState([])
    const [editedCategories, setEditedCategories] = useState({})
    const [files, setFiles] = useState({})

    useEffect(() => {
        fetch('http://127.0.0.1:8000/categories/', { method: 'GET' })
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(error => console.log(error));
    }, [])

    const handleChangeName = (id, value) => {
        setEditedCategories(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                name: value
            }
        }))
    }

    const handleChangeDescription = (id, value) => {
        setEditedCategories(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                description: value
            }
        }))
    }

    const handleFileChange = (id, file) => {
        setFiles(prevState => ({
            ...prevState,
            [id]: file
        }))
    }

    const handleSave = (id) => {
        const editedCategory = editedCategories[id] || {}
        const body = {
            category_name: editedCategory.name || categories.find(cat => cat.id === id).category_name,
            category_description: editedCategory.description || categories.find(cat => cat.id === id).category_description
        }

        fetch(`http://127.0.0.1:8000/categories/${id}/`, {
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
                        return RefreshToken().then(() => handleSave(id))
                    }
                    throw new Error('Failed to save changes')
                }
                return res.json();
            })
            .then(data => {
                setCategories(prevCategories =>
                    prevCategories.map(cat =>
                        cat.id === id ? data : cat
                    )
                )
                setEditedCategories(prevState => {
                    const newState = { ...prevState }
                    delete newState[id]
                    return newState
                })

            })
            .catch(error => console.log(error))

        if (files[id]) {
            handleFileUpload(id, files[id])
        }
    }

    const handleFileUpload = (id, file) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch(`http://127.0.0.1:8000/categories/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: formData
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        return RefreshToken().then(() => handleFileUpload(id, file))
                    }
                    throw new Error('Failed to upload image')
                }
                return res.json()
            })
            .then(data => {
                setCategories(prevCategories =>
                    prevCategories.map(cat =>
                        cat.id === id ? data : cat
                    )
                )
            })
            .catch(error => console.log(error))
    }


    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/categories/${id}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    return RefreshToken().then(() => handleDelete(id))
                }
                throw new Error('Failed to delete category')
            }
            setCategories(prevCategories =>
                prevCategories.filter(cat => cat.id !== id)
            )
        })
        .catch(error => console.log(error))
    }


    if (categories.length < 1) {
        return (<div className='loading'>Loading...</div>);
    }

    return (
        <div className='categories'>

            <div className='categories-content'>
                <Link className='link-to-category-create' to={'/categories/create'}>Создать категорию</Link>
                <ul>
                    {categories.map(category => {
                        const editedCategory = editedCategories[category.id] || {};
                        return (
                            <form key={category.id} onSubmit={(e) => { e.preventDefault(); handleSave(category.id); }}>
                                <li>
                                    <div className='category-data'>
                                        <input
                                            onChange={(e) => handleChangeName(category.id, e.target.value)}
                                            type="text"
                                            placeholder='Name'
                                            value={editedCategory.name !== undefined ? editedCategory.name : category.category_name}
                                        />
                                        <div>
                                            <img src={`http://127.0.0.1:8000/img/${category.category_img}`} alt={`${category.category_name}`} />
                                            <textarea
                                                onChange={(e) => handleChangeDescription(category.id, e.target.value)}
                                                placeholder='Description'
                                                value={editedCategory.description !== undefined ? editedCategory.description : category.category_description}
                                            />
                                        </div>
                                        <input 
                                            type="file" 
                                            onChange={(e) => handleFileChange(category.id, e.target.files[0])} 
                                        />
                                        <button type='submit'>Сохранить</button>
                                        <button className='category-delete' onClick={() => handleDelete(category.id)}>Удалить</button>
                                    </div>
                                </li>
                            </form>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
};
