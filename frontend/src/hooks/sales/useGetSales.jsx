import { useState, useEffect } from 'react';
import { getSales } from '@services/ventas.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const response = await getSales();
            
            if (!Array.isArray(response)) {
                showWarningAlert("¡Advertencia!", "No existen registros de ventas.");
                return;
            }

            const formattedData = response.map(sale => ({
                id: sale.id,  
                inventoryItemId: sale.inventoryItemId,  
                quantity: sale.quantity,  
                totalPrice: sale.totalPrice,  
                createdAt: sale.createdAt,  
                inventoryItemName: sale.inventoryItem?.name,  
                inventoryItemPrice: sale.inventoryItem?.price,  
                inventoryItemType: sale.inventoryItem?.type,  
            }));

            setSales(formattedData);
        } catch (error) {
            console.error("Error: ", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return { sales, fetchSales, setSales, loading, error };
};

export default useGetSales;
