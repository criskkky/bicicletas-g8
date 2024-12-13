import axios from './root.service.js';
import { formatDataOrder } from '@helpers/formatDataOrder.js';

// Función para obtener todas las órdenes
export async function getOrders() {
    try {
        const response = await axios.get('/orders/');
        
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_orden`
        const formattedData = response.data.map(order => ({
            ...formatDataOrder(order),
        }));
        return formattedData;
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        return { error: error.message || 'Error al obtener las órdenes' };
    }
}

// Función para obtener una orden específica por su ID
export async function getOrder(id_orden) {
    try {
        const { data } = await axios.get(`/orders/view/${id_orden}`);
        return {
            ...formatDataOrder(data.data),
            id_orden: data.data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener la orden' };
    }
}

// Función para crear una nueva orden
export async function createOrder(orderData) {
    try {
        const response = await axios.post('/orders/add', orderData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear la orden' };
    }
}

// Función para actualizar una orden existente
export async function updateOrder(id_orden, orderData) {
    try {
        console.log('Datos enviados al backend:', orderData);

        const response = await axios.patch(`/orders/edit/${id_orden}`, orderData);

        if (!response.data || typeof response.data !== 'object') {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }

        console.log('Datos de orden actualizados correctamente:', response.data);

        const updatedOrder = response.data.order || response.data;
        if (!updatedOrder.id_orden && !updatedOrder.id) {
            console.error('Respuesta del servidor:', response.data);
            throw new Error('La orden actualizada no está presente en la respuesta del servidor');
        }

        return {
            ...updatedOrder,
            id_orden: updatedOrder.id_orden || updatedOrder.id || id_orden,
        };
    } catch (error) {
        console.error('Error en updateOrder:', error.response?.data || error.message);
        console.log('Datos enviados:', orderData);
        throw error;
    }
}

// Función para eliminar una orden
export async function deleteOrder(id_orden) {
    try {
        const response = await axios.delete(`/orders/delete/${id_orden}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar la orden' };
    }
}
