import './products.css'
import { Link } from 'react-router-dom';
export const Products = () => {
    return ( 
        <div className="products-menu">
            <ul>
                <Link to={'/products/all'}>
                    <li>
                        All
                    </li>
                </Link>
                <Link to={'/products/create'}>
                    <li>
                        Create
                    </li>
                </Link>
                <Link to={'/products/update'}>
                    <li>
                        Update
                    </li>
                </Link>
                <Link to={'/products/delete'}>
                    <li>
                        Delete
                    </li>
                </Link>
            </ul>
        </div> 
    );
}