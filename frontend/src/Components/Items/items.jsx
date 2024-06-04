import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './items.css';
import { AnimatePresence, motion } from "framer-motion";
import { ModalItem } from "../../api";

const Items = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const closeModal = () => {
        setSelectedItem(null);
    };

    const handleCloseModal = (event) => {
        if (event.target.classList.contains('modalOverlay')) {
            closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleCloseModal);

        return () => {
            document.removeEventListener('click', handleCloseModal);
        };
    }, []);

    useEffect(() => {
        setLoading(true); 
        fetch(`http://127.0.0.1:8000/products/category/?category_id=${id}`)
            .then(response => response.json())
            .then(result => {
                setItems(result);
                setLoading(false); 
            })
            .catch(error => {
                console.error('error', error);
                setLoading(false); 
            });
    }, [id]);
    
    const openModal = (item) => {
        setSelectedItem(item);
    };

    return (
        <AnimatePresence>
            <motion.div className="allItems"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
            >
                {loading ? (
                   <p style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', fontSize: '30px', fontWeight: 'bold', color: 'white' }}>Loading...</p>
                ) : (
                    Array.isArray(items) && items.length > 0 ? (
                        <ul>
                            {items.map((item) => (
                                <li key={item.id} onClick={() => openModal(item)}>
                                    <div className="itemContainer">
                                        <img src={`http://127.0.0.1:8000/img/${item.product_img}`} alt={item.product_name} />
                                        <div className="Overlay">
                                            <h1 className="itemTitle">{item.product_name}</h1>
                                        </div>
                                        <div className="itemDesc" style={{cursor: 'pointer'}}>Нажмите, чтобы узнать больше</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'white', textAlign: 'center', fontSize: '24px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>Извините, товары отсутствуют в наличии.</p>
                    )
                )}
            </motion.div>
            {selectedItem && (
                ModalItem(selectedItem)
            )}
        </AnimatePresence>
    );
};

export default Items;
