import axios from './root.service.js';

export async function getInventory() {
    try {
        const response = await axios.get('/inventory/');
        console.log('Respuesta de la API:', response);

        if (!response || !response.data) {
            throw new Error("Respuesta de la API no válida.");
        }

        return response.data;
    } catch (error) {
        console.error("Error al obtener inventario:", error);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
        }
        return { error: error.message || 'Error al obtener los artículos de inventario' };
    }
}

export async function getInventoryItem(inventoryId) {
    try {
        const { data } = await axios.get(`/inventory/view/${inventoryId}`);
        return data;
    } catch (error) {
        console.error("Error al obtener el artículo de inventario:", error);
        return { error: error.message || 'Error al obtener el artículo de inventario' };
    }
}

export async function createInventoryItem(inventoryData) {
    try {
        const response = await axios.post('/inventory/add', inventoryData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el artículo de inventario:", error);
        return { error: error.message || 'Error al crear el artículo de inventario' };
    }
}

export async function updateInventoryItem(inventoryId, inventoryData) {
    try {
        const response = await axios.patch(`/inventory/edit/${inventoryId}`, inventoryData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el artículo de inventario:", error);
        return { error: error.message || 'Error al actualizar el artículo de inventario' };
    }
}

export async function deleteInventoryItem(inventoryId) {
    try {
        const response = await axios.delete(`/inventory/delete/${inventoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el artículo de inventario:", error);
        return { error: error.message || 'Error al eliminar el artículo de inventario' };
    }
}
