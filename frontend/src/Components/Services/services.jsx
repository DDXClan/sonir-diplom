import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './services.css';
import { ModalItem } from "../../api";
import { motion, AnimatePresence } from "framer-motion";

const Services = () => {
    const [prod, setProd] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://127.0.0.1:8000/products/category/Услуги`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setProd(result);
                setLoading(false);
            })
            .catch(error => console.log('error', error));
    }, []);

    const generateBlackAndWhiteSequence = (id) => {
        const hashCode = Math.abs(id) % 2;
        return hashCode === 0
            ? { background: '#0C151C', color: '#FFFFFF' }
            : { background: '#E4E5EA', color: '#000000' };
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.classList.contains('modalOverlay')) {
                setSelectedItem(null);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <AnimatePresence>
            <motion.div className="allServices"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
            >
                {loading ? (
                    <p style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', fontSize: '30px', fontWeight: 'bold', color: 'white' }}>Loading...</p>
                ) : (
                    <ul>
                        {prod.map((item) => (
                            <div key={item.id}>
                                <Link to="#" style={{ color: generateBlackAndWhiteSequence(item.id).color }} onClick={() => handleItemClick(item)}>
                                    <div className="container-services">
                                        <li style={generateBlackAndWhiteSequence(item.id)}>
                                            {item.product_name}
                                        </li>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </ul>
                )}
                {selectedItem && (
                    ModalItem(selectedItem)
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default Services;
