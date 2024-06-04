import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { useState } from 'react';

import button from '../../button.svg'

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const hasToken = sessionStorage.getItem('access_token');
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  const deleteToken = () => {
    sessionStorage.removeItem('access_token');
    navigate('/');
  };

    return ( 

      <div className="app-container">
        <button onClick={togglePanel} className={`center-right-button ${isOpen ? 'opened' : ''}`}>
          <img src={button} className={`button-svg ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`side-panel ${isOpen ? 'open' : ''}`}>
          <div className="allHeader">
            <div className='navbar'>
              <nav>
                <ul>
                    <Link to ="/"><li>Главная</li></Link>
                    <Link to ="/services"><li>Наши услуги</li></Link>
                    {hasToken && <Link to="/profile"><li>Профиль</li></Link>} 
                    {!hasToken && <Link to ="/login"><li>Зарегистрироваться</li></Link>}

                </ul>
                {hasToken && <p style={{cursor: 'pointer'}} onClick={deleteToken}>Выйти</p> } : {!hasToken && <Link to ="/login"><p>Войти</p></Link>}
              </nav>
            </div>
        </div>
        </div>
      </div>
    );
  };
 
export default Header;