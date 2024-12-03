import { useState } from 'react';
import { updateSale } from '@services/ventas.service.js'; 

const useEditSale = (setSales) => {
    const [dataSale, setDataSale] = useState(null);

    const handleUpdate = async (updatedSaleData) => {
        try {
            const response = await updateSale(updatedSaleData);
            if (response) {
                setSales(prevState => prevState.map(sale => sale.id === updatedSaleData.id ? response : sale));
                setDataSale(response);
            }
        } catch (error) {
            console.error("Error al actualizar venta:", error);
        }
    };

    return { handleUpdate, dataSale, setDataSale };
};

export default useEditSale;
