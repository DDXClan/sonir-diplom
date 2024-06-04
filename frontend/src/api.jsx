import { motion } from 'framer-motion'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const API_CLIENT = 'http://localhost:8080/api/'

export const ModalItem = (selectedItem ) => {


    const handleSubmit = () => {
        fetch('http://127.0.0.1:8000/orders/', {
            method: 'POST',
            body: JSON.stringify({'product_id': selectedItem.id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
        .then(res => {
            if(res.status == 201) {
                const confirmationMessage = document.createElement('p');
                confirmationMessage.textContent = 'Ваш заказ принят!';
                confirmationMessage.style.color = 'green';
                confirmationMessage.style.fontWeight = 'bold';
                
                const modalContent = document.querySelector('.modalContent');
                if (modalContent) {
                    modalContent.appendChild(confirmationMessage);
                }
            }
            if(res.status == 401) { RefreshToken().then(() => handleSubmit()) }
            return res.json()
        })
        .catch(error => console.log(error))
    };
    const isLoggedIn = sessionStorage.getItem('access_token') !== null;
    return (
        <motion.div
            className="modalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="modalContent"
                initial={{ y: "-100vh" }}
                animate={{ y: 0 }}
                exit={{ y: "-100vh"}}
            >
                <h2>{selectedItem.product_name}</h2>
                <p>{selectedItem.product_description}</p>
                <p>Примерная стоимость заказа: <span style={{fontWeight: 'bold', borderBottom: '1px solid black'}}>{selectedItem.price}</span> руб.</p>
                {isLoggedIn ? (
                    <button onClick={handleSubmit}>Заказать</button>
                ) : (
                    <p>Пожалуйста <Link to="/login" style={{color: 'blue', borderBottom: '1px solid blue', fontWeight: 'bold'}}>войдите</Link> в свой профиль, чтобы сделать заказ</p>
                )}
            </motion.div>
        </motion.div>
    )
}

export const RefreshToken = () => {
    fetch('http://127.0.0.1:8000/auth/refresh', {
        method: 'PATCH', 
        body: JSON.stringify({'refresh_token': localStorage.getItem('refresh_token')}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            sessionStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.reload();
            throw new Error('Failed to refresh token');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token' , data.refresh_token);
    })
    .catch(error => console.log('There was an error refreshing the token:', error));
}