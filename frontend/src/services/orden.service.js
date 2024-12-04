import axios from './root.service.js';
import { formatDataOrder } from '@helpers/formatDataOrder.js'; 


export async function getOrders() {
    try {
        const response = await axios.get('/orders'); 
        console.log('Respuesta de la API:', response);  

       
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        
        const formattedData = response.data.map(formatDataOrder);
        return formattedData;
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        return { error: error.message || 'Error al obtener las órdenes' }; 
    }
}


export async function getOrder(orderId) {
    try {
        const { data } = await axios.get(`/orders/view/${orderId}`);
        return formatDataOrder(data); 
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        return { error: error.message || 'Error al obtener la orden' };
    }
}


export async function createOrder(orderData) {
    try {
        const response = await axios.post('/orders/add', {
            workerRUT: orderData.workerRUT,
            jobType: orderData.jobType,
            jobID: orderData.jobID,
            hoursWorked: orderData.hoursWorked,
            note: orderData.note || '',
        });
        return response.data; 
    } catch (error) {
        console.error("Error al crear la orden:", error);
        return { error: error.message || 'Error al crear la orden' };
    }
}


export async function updateOrder(orderId, orderData) {
    try {
        const response = await axios.patch(`/orders/edit/${orderId}`, {
            workerRUT: orderData.workerRUT,
            jobType: orderData.jobType,
            jobID: orderData.jobID,
            hoursWorked: orderData.hoursWorked,
            note: orderData.note || '', 
        });
        return response.data; 
    } catch (error) {
        console.error("Error al actualizar la orden:", error);
        return { error: error.message || 'Error al actualizar la orden' };
    }
}


export async function deleteOrder(orderId) {
    try {
        const response = await axios.delete(`/orders/delete/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la orden:", error);
        return { error: error.message || 'Error al eliminar la orden' };
    }
}
