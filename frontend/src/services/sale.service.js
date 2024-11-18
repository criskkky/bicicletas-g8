import axios from './root.service.js';  

export async function getSales() {
    try {
        const { data } = await axios.get('/sale');  
        return data;
    } catch (error) {
        return error.response?.data || error.message;  
    }
}

// Obtener una venta por ID
export async function getSaleById(id) {
    try {
        const { data } = await axios.get(`/sale/${id}`);
        return data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

// Actualizar una venta
export async function updateSale(id, data) {
    try {
        const response = await axios.put(`/sale/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}

// Eliminar una venta
export async function deleteSale(id) {
    try {
        const response = await axios.delete(`/sale/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error.message;
    }
}