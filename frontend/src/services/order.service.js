import axios from './root.service.js';
import { formatDataOrder } from '@helpers/formatDataOrder.js'; // Importa el helper para formatear los datos de la orden

// Función para obtener todas las órdenes de trabajo
export async function getOrders() {
    try {
        const response = await axios.get('/orders'); // Asegúrate de que la ruta sea la correcta
        console.log('Respuesta de la API:', response);  // Ver la respuesta completa

        // Verifica que la propiedad 'data' esté presente y contiene los elementos esperados
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatear los datos de las órdenes utilizando el helper
        const formattedData = response.data.map(formatDataOrder); // Usa directamente response.data
        return formattedData;
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        return { error: error.message || 'Error al obtener las órdenes' }; // Mensaje de error más claro
    }
}

// Función para obtener una orden de trabajo específica por su ID
export async function getOrder(orderId) {
    try {
        const { data } = await axios.get(`/orders/view/${orderId}`);
        return formatDataOrder(data.data); // Formatear la orden de trabajo específica
    } catch (error) {
        return error.response.data;
    }
}

// Función para crear una nueva orden de trabajo
export async function createOrder(orderData) {
    try {
        const response = await axios.post('/orders/add', orderData); // Ruta para crear una orden
        return response.data; // Retorna la orden creada
    } catch (error) {
        return error.response.data;
    }
}

// Función para actualizar una orden de trabajo existente
export async function updateOrder(orderId, orderData) {
    try {
        const response = await axios.patch(`/orders/edit/${orderId}`, orderData);
        return response.data; // Retorna la orden actualizada
    } catch (error) {
        return error.response.data;
    }
}

// Función para eliminar una orden de trabajo
export async function deleteOrder(orderId) {
    try {
        const response = await axios.delete(`/orders/delete/${orderId}`);
        return response.data; // Retorna la respuesta del servidor
    } catch (error) {
        return error.response.data;
    }
}
