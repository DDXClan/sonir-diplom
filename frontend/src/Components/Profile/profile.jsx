import { useEffect, useState } from "react";
import './profile.css';
import { Link, useNavigate } from 'react-router-dom';
import infoIcon from "./../../info.png"
import orderIcon from "./../../order.png"
import { RefreshToken } from "../../api";
const Profile = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('access_token')
    if(token === null) navigate('/login')
    const [userdata, setUserdata] = useState({});
    
    const fetchUserData = () => {
        fetch('http://127.0.0.1:8000/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                return RefreshToken().then(() => fetchUserData());
            }
            return response.json();
        })
        .then(data => {
            setUserdata(data);
        })
        .catch(error => console.log('error', error));
    };

    useEffect(() => {
        fetchUserData();
    }, []);
    const [profileImg, setProfileImg] = useState(null)
    const handleProfileImgChange = (event) =>
        {
            setProfileImg(event.target.files[0])
        }

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const updateProfilePicture = (event) => {
        event.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);
        const formData = new FormData();
        formData.append('image', profileImg, profileImg.name);
    
        fetch('http://127.0.0.1:8000/user/', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return RefreshToken().then(() => updateProfilePicture());
                }
                throw new Error('Failed to update profile picture. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile picture updated successfully:', data);
            setSuccess(true);
            window.location.reload();
        })
        .catch(error => {
            setError(error);
            console.error('Error updating profile picture:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    };
    const [orders, setOrders] = useState([]);

    const fetchOrders = () => {
        fetch('http://127.0.0.1:8000/orders/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                return RefreshToken().then(() => fetchOrders());
            }
            return response.json();
        })
        .then(data => {
            setOrders(data);
        })
        .catch(error => console.log('error', error));
    };
    
    useEffect(() => {
        fetchOrders();
    }, [token]);


    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        
        let age = today.getFullYear() - birth.getFullYear();
        
        if (today.getMonth() < birth.getMonth() || 
            (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const [isOpenOrder, setIsOpenOrder] = useState(false);

    const togglePanelOrder = () => {
        setIsOpenOrder(!isOpenOrder);
    };

    if(!userdata, !orders) {
        return <p style={{ color: 'white', textAlign: 'center' , fontSize: '24px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>Loading...</p>
    }

    return ( 
        <div className="profile-container">
            {loading && <p>Loading...</p>}
            {success && <p>Profile updated successfully!</p>}
            {error && <p>Error: {error.message}</p>}
            <div className="profile-content">
                <div className="img-container">
                    <h1>{userdata.username}</h1>
                    <img src={`http://127.0.0.1:8000/img/${userdata.profile_img}`} alt="" />
                </div>
                <div className="toggle-button" onClick={togglePanel}>
                    <img style={{width: '35px', height: '35px', cursor: 'pointer'}} src={infoIcon} alt="" />
                    {isOpen && (
                    <div className="profile-info">
                        <p>{userdata.email}</p>
                        <p>Ваш возраст: {calculateAge(userdata.date_birth)} лет</p>
                        <p>Ваш пол: {userdata.geneder}</p>
                    </div>
                    )}
                </div>
                <div className="toggle-button-order" onClick={togglePanelOrder}>
                    <img style={{width: '35px', height: '35px', cursor: 'pointer'}} src={orderIcon} alt="" />
                    {isOpenOrder && (
                        <div className="profile-order">
                            <h1 style={{textAlign: 'center'}}>Ваши заказы</h1>
                            <div className="profile-order-list">    
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    <ul>
                                        {orders.map(order => (
                                            <li key={order.id}>
                                                <p>{order.product.name}</p>
                                                <p>Статус заказа: {order.status}</p>
                                                <p>Сумма: {order.product.price} руб.</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Вы ничего не заказывали.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <form onSubmit={updateProfilePicture}>
                <input type="file" placeholder="Выберите изображение" onChange={handleProfileImgChange} />
                <button type="submit">Update Profile Picture</button>
            </form>
        </div>
    );
    
}
 
export default Profile;