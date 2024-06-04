import './login.css'
import { useState } from "react";

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (e) => { setEmail(e.target.value) }

    const handlePasswordChange = (e) => { setPassword(e.target.value) }

    const handleLogin = (e) => 
        {
            e.preventDefault()
            if(!email || !password)
            {
                return
            }
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            fetch('http://127.0.0.1:8000/auth/login', {method: 'POST', body: formData})
            .then(res => res.json())
            .then(data => {
                if(data.role === 'admin')
                {
                    sessionStorage.setItem('access_token' , data.access_token)
                    localStorage.setItem('refresh_token' , data.refresh_token)
                    window.location.reload()
                }
            })
            .catch(error => console.log(error))
        }

    return ( 
        <div className="login">
            <form className="login-form" onSubmit={handleLogin}>
                <label>Вход</label>
                <input type="text" placeholder="email" onChange={handleEmailChange}/>
                <input type="password" placeholder="password" onChange={handlePasswordChange} />
                <button type="submit">Войти</button>
            </form>
        </div>
     );
}