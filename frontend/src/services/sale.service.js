import axios from './root.service.js';

// Función para obtener todas las ventas
export async function getSales() {
    try {
        const response = await axios.get('/sale/');
        console.log('Respuesta de la API:', response);

        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        return response.data;
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
        }
        return { error: error.message || 'Error al obtener las ventas' };
    }
}

// Función para obtener una venta específica por su ID
export async function getSale(saleId) {
    try {
        const { data } = await axios.get(`/sales/view/${saleId}`);
        return data;
    } catch (error) {
        console.error("Error al obtener la venta:", error);
        return { error: error.message || 'Error al obtener la venta' };
    }
}

// Función para crear una nueva venta
export async function createSale(saleData) {
    try {
        const response = await axios.post('/sales/add', saleData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la venta:", error);
        return { error: error.message || 'Error al crear la venta' };
    }
}

// Función para actualizar una venta existente
export async function updateSale(saleId, saleData) {
    try {
        const response = await axios.patch(`/sales/edit/${saleId}`, saleData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        return { error: error.message || 'Error al actualizar la venta' };
    }
}

// Función para eliminar una venta
export async function deleteSale(saleId) {
    try {
        const response = await axios.delete(`/sales/delete/${saleId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        return { error: error.message || 'Error al eliminar la venta' };
    }
}
