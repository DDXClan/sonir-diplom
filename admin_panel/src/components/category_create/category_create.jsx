import { useNavigate } from 'react-router-dom';
import { RefreshToken } from '../api';
import './category_create.css'
import { useState } from 'react';
export const CreateCategory = () => {

    const navigate = useNavigate()

    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)

    const handleChangeName = (e) => { setName(e.target.value) }
    const handleChangeDescription = (e) => { setDescription(e.target.value) }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!name || !description) { return }
        createCategory()
    }

    const createCategory = () => {
        fetch('http://127.0.0.1:8000/categories', {
            method : 'POST', 
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                category_name: name,
                category_description: description
            })
        })
        .then(res => {
            if(!res.ok || res.status !== 201)
                { if(res.status === 401) { RefreshToken().then(createCategory) } 
            return res.json
        }
        }).then(data => {if(data) { navigate('/categories') } }).catch(error => console.log(error))
    }

    return ( 
        <div className='category-create'>
            <div className='category-create-content'>
                <h1>Создать категорию</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} placeholder='name' onChange={handleChangeName} />
                    <textarea placeholder='description' value={description} onChange={handleChangeDescription}></textarea>
                    <button type='submit'>Создать</button>
                </form>
            </div>
        </div>
     );
}