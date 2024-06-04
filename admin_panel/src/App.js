import './App.css';
import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/nav_bar/nav';
import { Products } from './components/products/products';
import { AllProducts } from './components/all_products/all_products';
import { Product } from './components/product/product';
import { Login } from './components/login/login';
import { CreateProduct } from './components/create_product/create_product';
import { DeleteProduct } from './components/delete_product/delete_product';
import { UpdateProduct } from './components/update_product/update_product';
import { Categories } from './components/categories/categories';
import { CreateCategory } from './components/category_create/category_create';
import { Orders } from './components/orders/orders';
function App() {

  if(sessionStorage.getItem('access_token') == null ) return ( <Login/> )
  return (
    <div className="App">
      <div style={{'display': 'flex'}}>
      <NavBar />
        <Routes>
          <Route path='/products' element={<Products />} />
          <Route path='/products/all' element={<AllProducts/>} />
          <Route path='/products/create' element={<CreateProduct />} />
          <Route path='/products/:id' element={<Product />} />
          <Route path='/products/delete' element={<AllProducts />} />
          <Route path='/products/delete/:id' element={<DeleteProduct />} />
          <Route path='/products/update' element={<AllProducts />} />
          <Route path='/products/update/:id' element={<UpdateProduct />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/categories/create' element={<CreateCategory />} />
          <Route path='/orders' element={<Orders />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
