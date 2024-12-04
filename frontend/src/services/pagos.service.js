import axios from './root.service.js';
import { formatDataPayment } from '@helpers/formatDataPayment.js'; // Importa el helper para formatear los datos

// Función para obtener todos los pagos
export async function getPayments() {
    try {
        const response = await axios.get('/pagos/');
        console.log('Respuesta de la API:', response); // Ver la respuesta completa

        // Verifica que la propiedad 'data' esté presente y contiene los elementos esperados
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatear los datos de pagos utilizando el helper
        const formattedData = response.data.map(formatDataPayment); // Usa directamente response.data
        return formattedData;
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        return { error: error.message || 'Error al obtener los pagos' }; // Mensaje de error más claro
    }
}

// Función para obtener un pago específico por su ID
export async function getPayment(paymentId) {
    try {
        const { data } = await axios.get(`/pagos/view/${paymentId}`);
        return formatDataPayment(data.data); // Formatear el pago específico
    } catch (error) {
        return error.response.data;
    }
}

// Función para crear un nuevo pago
export async function createPayment(paymentData) {
    try {
        const response = await axios.post('/pagos/add', paymentData);
        return response.data; // Retorna el pago creado
    } catch (error) {
        return error.response.data;
    }
}

// Función para actualizar un pago existente
export async function updatePayment(paymentId, paymentData) {
    try {
        const response = await axios.patch(`/pagos/edit/${paymentId}`, paymentData);
        return response.data; // Retorna el pago actualizado
    } catch (error) {
        return error.response.data;
    }
}

// Función para eliminar un pago
export async function deletePayment(paymentId) {
    try {
        const response = await axios.delete(`/pagos/delete/${paymentId}`);
        return response.data; // Retorna la respuesta del servidor
    } catch (error) {
        return error.response.data;
    }
}
