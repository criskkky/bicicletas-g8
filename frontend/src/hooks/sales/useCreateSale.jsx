import { useState } from 'react';
import { createSale } from '@services/sale.service.js';

const useCreateSale = (setSales) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newSaleData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createSale(newSaleData);
            if (response) {
                setSales(prevState => [...prevState, response]);
                window.location.reload();
            }
        } catch (error) {
            setError(error);
            console.error("Error al crear venta:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateSale;
