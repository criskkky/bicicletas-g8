import axios from './root.service.js';
import { formatDataInvoice } from '@helpers/formatDataInvoice.js';

// Función para obtener todas las facturas
export async function getInvoices() {
    try {
        const response = await axios.get('/facturas/');
        
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_factura`
        const formattedData = response.data.map(invoice => ({
            ...formatDataInvoice(invoice),
        }));
        return formattedData;
    } catch (error) {
        console.error("Error al obtener facturas:", error);
        return { error: error.message || 'Error al obtener las facturas' };
    }
}

// Función para obtener una factura específica por su ID
export async function getInvoice(id_factura) {
    try {
        const { data } = await axios.get(`/facturas/view/${id_factura}`);
        return {
            ...formatDataInvoice(data),
            id_factura: data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener la factura' };
    }
}

// Función para crear una nueva factura
export async function createInvoice(invoiceData) {
    try {
        const response = await axios.post('/facturas/add', invoiceData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear la factura' };
    }
}

// Función para actualizar una factura existente
export async function updateInvoice(id_factura, invoiceData) {
    try {
        console.log('Datos enviados al backend:', invoiceData);

        const response = await axios.patch(`/facturas/edit/${id_factura}`, invoiceData);

        if (!response.data || typeof response.data !== 'object') {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }

        console.log('Datos de factura actualizados correctamente:', response.data);

        const updatedInvoice = response.data.invoice || response.data;
        if (!updatedInvoice.id_factura && !updatedInvoice.id) {
            console.error('Respuesta del servidor:', response.data);
            throw new Error('La factura actualizada no está presente en la respuesta del servidor');
        }

        return {
            ...updatedInvoice,
            id_factura: updatedInvoice.id_factura || updatedInvoice.id || id_factura,
        };
    } catch (error) {
        console.error('Error en updateInvoice:', error.response?.data || error.message);
        console.log('Datos enviados:', invoiceData);
        throw error;
    }
}

// Función para eliminar una factura
export async function deleteInvoice(id_factura) {
    try {
        const response = await axios.delete(`/facturas/delete/${id_factura}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar la factura' };
    }
}
