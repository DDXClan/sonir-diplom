import { RefreshToken } from '../api';
import './orders.css';
import { useEffect, useState } from 'react';

export const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    return RefreshToken().then(() => {
                        window.location.reload();
                    });
                }
                throw new Error('Failed to fetch orders');
            }
            return res.json();
        })
        .then(data => {
            console.log('Fetched orders:', data);
            setOrders(data);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className='loading' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', fontSize: '32px' }}>Loading...</div>;
    }

    if (!Array.isArray(orders) || orders.length < 1) {
        return <div className='loading'>No orders found</div>;
    }

    const newStatus = (e, id) => {
        fetch(`http://127.0.0.1:8000/orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ status: e.target.value })
        }).then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    RefreshToken().then(() => newStatus(e, id));
                }
                throw new Error('Failed to update status');
            }
            return res.json();
        })
        .then(data => {
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === id ? { ...order, status: data.status } : order
                )
            );
        })
        .catch(error => console.log(error));
    };

    return ( 
        <div className='orders'>
            <ul>
                {orders.map(ord => (
                    <li key={ord.id}>
                        <div className='orders-data'>
                            <p>Номер заказа {ord.id}</p>
                            <div>
                                <p>{ord.product.name}</p>
                                <p>Цена: {ord.product.price}₽</p>
                            </div>
                            <p>{ord.user.email}</p>
                            <p>{ord.user.username}</p>
                            <p>Статус: {ord.status}</p>
                            <div>
                                
                                <select onChange={(e) => newStatus(e, ord.id)}>
                                    <option disabled selected>Новый статус</option>
                                    <option value="В рассмотрении">В рассмотрении</option>
                                    <option value="Принят">Принят</option>
                                    <option value="В работе">В работе</option>
                                    <option value="Готов к сдаче">Готов к сдаче</option>
                                    <option value="Отказано">Отказано</option>
                                </select>
                            </div>
                            <p>Адрес: {ord.address}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
