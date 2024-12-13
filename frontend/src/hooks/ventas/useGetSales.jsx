import { useState, useEffect } from 'react';
import { getSales } from '@services/ventas.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetSales = () => {
    const [sales, setSales] = useState([]);

    const formatSaleData = (sale) => {
        const items = Array.isArray(sale.items)
            ? sale.items.map(item => `ID: ${item.id_item}, Cantidad: ${item.cantidad}`).join(', ')
            : "N/A";
    
        return {
            id_venta: sale.id_venta,
            rut_trabajador: sale.rut_trabajador,
            rut_cliente: sale.rut_cliente,
            fecha_venta: sale.fecha_venta,
            items,
            total: sale.total,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
        };
    };
    
    const fetchSales = async () => {
        try {
            const response = await getSales();
            console.log(response); // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de ventas.");
            }

            const formattedData = response.map(formatSaleData);
            setSales(formattedData);
        } catch (error) {
            console.error("Error al obtener las ventas: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos de ventas.");
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return { sales, fetchSales, setSales };
};

export default useGetSales;
