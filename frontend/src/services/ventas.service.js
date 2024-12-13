import axios from './root.service.js';
import { formatDataSale } from '@helpers/formatDataSales.js';

// Función para obtener todas las ventas
export async function getSales() {
    try {
        const response = await axios.get('/sale/');

        // Si response.data no es un array, lo convertimos en uno
        const salesData = Array.isArray(response.data) ? response.data : [response.data];

        const formattedData = salesData.map(sale => ({
            ...formatDataSale(sale),
        }));

        return formattedData;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        return { error: error.message || 'Error al obtener las ventas' };
    }
}

// Función para obtener una venta específica por su ID
export async function getSale(id_venta) {
    try {
        const { data } = await axios.get(`/sale/${id_venta}`);
        return {
            ...formatDataSale(data),
            id_venta: data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener la venta' };
    }
}

// Función para crear una nueva venta
export async function createSale(saleData) {
    try {
        const response = await axios.post('/sale/', saleData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear la venta' };
    }
}

// Función para actualizar una venta existente
export async function updateSale(id_venta, saleData) {
    try {
        const response = await axios.patch(`/sale/${id_venta}`, saleData);
        console.log('Datos de venta actualizados:', response.data);
        
        if (!response.data || !response.data.sale) {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }
        
        // Aseguramos que id_venta esté presente
        return {
            ...response.data.sale,
            id_venta: response.data.sale.id || id_venta,
        };
    } catch (error) {
        console.error('Error en updateSale:', error);
        throw error;
    }
}

// Función para eliminar una venta
export async function deleteSale(id_venta) {
    try {
        const response = await axios.delete(`/sale/${id_venta}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar la venta' };
    }
}
