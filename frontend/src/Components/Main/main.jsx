import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import './main.css'
import { Link } from "react-router-dom";

const Main = () => {
    const [category, setCategory] = useState([]);
    useEffect(() => 
        {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`http://127.0.0.1:8000/categories/`, requestOptions)
            .then(response => response.json())
            .then(result => setCategory(result.filter(item => item.category_name !== 'Услуги')))
            .catch(error => console.log('error', error));
        }, [])
        return ( 
            <div className="allMain">
                <AnimatePresence>
                    {category.map((item) => (
                        <motion.div
                            className="cat"
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="catText">
                                <h1>{item.category_name}</h1>
                                <p>{item.category_description}</p>
                            </div>
                            <img src={`http://127.0.0.1:8000/img/${item.category_img}`} alt=""/>
                            <Link to={`/category/${item.id}`}><button>Перейти к разделу</button></Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        );
    }
 
export default Main;