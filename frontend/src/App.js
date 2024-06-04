import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from "./Components/Header/header";
import './App.css';
import Main from "./Components/Main/main";
import { AnimatePresence} from "framer-motion";
import Items from './Components/Items/items';
import Login from './Components/Login/login';
import Services from './Components/Services/services';
import Profile from './Components/Profile/profile';

function App() {
  return (
    <>
      <Header/>
      <AnimatePresence exitBeforeEnter = {false} mode='wait'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path='category/:id' element={<Items />} />
          <Route path='/login' element={<Login />} />
          <Route path='/services' element ={<Services />} />
          <Route path='/profile' element ={<Profile />} />
        </Routes>
      </AnimatePresence>
        
    </>
  );
}

export default App;
