import axios from './root.service.js';
import { formatDataPayment } from '@helpers/formatDataPayment.js';

// Función para obtener todos los pagos
export async function getPayments() {
    try {
        const response = await axios.get('/pagos/');
        
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_pago`
        const formattedData = response.data.map(payment => ({
            ...formatDataPayment(payment),
        }));
        return formattedData;
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        return { error: error.message || 'Error al obtener los pagos' };
    }
}

// Función para obtener un pago específico por su ID
export async function getPayment(id_pago) {
    try {
        const { data } = await axios.get(`/pagos/view/${id_pago}`);
        return {
            ...formatDataPayment(data.data),
            id_pago: data.data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener el pago' };
    }
}

// Función para crear un nuevo pago
export async function createPayment(paymentData) {
    try {
        const response = await axios.post('/pagos/add', paymentData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear el pago' };
    }
}

// Función para actualizar un pago existente
export async function updatePayment(id_pago, paymentData) {
    try {
        console.log('Datos enviados al backend:', paymentData);

        const response = await axios.patch(`/pagos/edit/${id_pago}`, paymentData);

        if (!response.data || typeof response.data !== 'object') {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }

        console.log('Datos de pago actualizados correctamente:', response.data);

        const updatedPayment = response.data.payment || response.data;
        if (!updatedPayment.id_pago && !updatedPayment.id) {
            console.error('Respuesta del servidor:', response.data);
            throw new Error('El pago actualizado no está presente en la respuesta del servidor');
        }

        return {
            ...updatedPayment,
            id_pago: updatedPayment.id_pago || updatedPayment.id || id_pago,
        };
    } catch (error) {
        console.error('Error en updatePayment:', error.response?.data || error.message);
        console.log('Datos enviados:', paymentData);
        throw error;
    }
}

// Función para eliminar un pago
export async function deletePayment(id_pago) {
    try {
        const response = await axios.delete(`/pagos/delete/${id_pago}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar el pago' };
    }
}
