import axios from './root.service.js';

// Obtener todas las ventas
export async function getSales() {
    try {
        const response = await axios.get('/sale/');
        console.log('Respuesta de la API:', response);

        if (!response || !response.data) {
            throw new Error("Respuesta de la API no válida.");
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

// Obtener una venta por ID
export async function getSale(saleId) {
    try {
        const { data } = await axios.get(`/sale/${saleId}`);
        return data;
    } catch (error) {
        console.error("Error al obtener la venta:", error);
        return { error: error.message || 'Error al obtener la venta' };
    }
}

// Crear una nueva venta
export async function createSale(saleData) {
    try {
        const response = await axios.post('/sale/', saleData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la venta:", error);
        return { error: error.message || 'Error al crear la venta' };
    }
}

// Actualizar una venta
export async function updateSale(saleId, saleData) {
    try {
        const response = await axios.patch(`/sale/${saleId}`, saleData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        return { error: error.message || 'Error al actualizar la venta' };
    }
}

// Eliminar una venta
export async function deleteSale(saleId) {
    try {
        const response = await axios.delete(`/sale/${saleId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        return { error: error.message || 'Error al eliminar la venta' };
    }
}
