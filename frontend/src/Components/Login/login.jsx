
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        if (newPassword.length < 6) {
            setPasswordStrength('У вас слишком слабый пароль');
        } else {
            setPasswordStrength('Хороший пароль');
        }
    };
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    }
    const handleDateChange = (event) => {
        setDate(event.target.value);
    }
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    
        const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            username: username,
            email: email,
            password: password,
            gender: gender,
            date_birth: date 
        };
        fetch('http://127.0.0.1:8000/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    const handleLogin = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('email', email);
        data.append('password', password);
        fetch('http://127.0.0.1:8000/auth/login', {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            const token = data.access_token;
            localStorage.setItem('refresh_token', data.refresh_token);
            sessionStorage.setItem('access_token', data.access_token);
            if(token){
                navigate('/profile');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    };
    

    const handleSignUp = () => {
        const container = document.getElementById('container');
        container.classList.add('right-panel-active');
    };
    
    const handleSignIn = () => {
        const container = document.getElementById('container');
        container.classList.remove('right-panel-active');
    };
    return ( 
        <div className="container"  id="container">
            <div className="form-container sign-up-container">
                <form onSubmit = {handleSubmit}>
                    <h1>Создать аккаунт</h1>
                    <input onChange={handleUsernameChange} type="text" placeholder="Name" />
                    <input value={email} onChange={handleEmailChange} type="email" placeholder="Email" />
                    <input onChange={handleDateChange} type="date" placeholder="Date" />
                    <input onChange={handleGenderChange} type="text" placeholder="Gender" />
                    <input onChange={handlePasswordChange} type="password" placeholder="Password" />
                    <p>{passwordStrength}</p>
                    <button type='submit'>Создать аккаунт</button>
                </form>
            </div>

            <div className="form-container sign-in-container">
                <form onSubmit = {handleLogin}>
                    <h1>Вход</h1>
                    <input onChange={handleEmailChange} type="email" placeholder="Email" />
                    <input onChange={handlePasswordChange} type="password" placeholder="Password" />
                    <button type='submit'>Вход</button>
                </form>
            </div>

        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1>Добро пожаловать назад!</h1>
                    <p>Чтобы оставаться на связи с нами, пожалуйста, войдите, используя свои личные данные.</p>
                    <button onClick={handleSignIn} className="ghost" id="signIn">Sign In</button>
                </div>
                <div className="overlay-panel overlay-right">
                    <h1>Привет, друг!</h1>
                    <p>Введите свои личные данные для входа в аккаунт</p>
                    <button onClick={handleSignUp} className="ghost" id="signUp">Sign Up</button>
                </div>
                </div>
            </div>
        </div>
     );
}
 
export default Login;