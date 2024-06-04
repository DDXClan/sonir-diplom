import { Link, useLocation } from "react-router-dom";
import './nav.css'
export const NavBar = () => {
    const location = useLocation()
    const currentPath = location.pathname
    const isActive = (path) => currentPath.includes(path);

    const Exit = () => {
        sessionStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload()
    }

    return ( 
        <div className="nav-bar-panel">
            <div className="nav-bar-content">
                <div className="nav-bar-panel-logo">
                    <img src="/static/img/logo.png"/>
                    <h1>Sonir</h1>
                </div>
                <nav>
                    <ul>
                        <Link to={'/products'}>
                            <li className={isActive('products') ? 'active' : ''}>
                                Products
                            </li>
                        </Link>
                        <Link to={'/categories'}>
                            <li className={isActive('categories') ? 'active' : ''}>
                                Category
                            </li>
                        </Link>
                        <Link to={'/orders'}>
                            <li className={isActive('orders') ? 'active' : ''}>
                                Orders
                            </li>
                        </Link>
                        <li onClick={() => Exit()}>
                            exit
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
     );
}