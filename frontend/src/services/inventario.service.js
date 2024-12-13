import axios from './root.service.js';
import { formatDataInventory } from '@helpers/formatDataInventory.js';

// Función para obtener todos los elementos del inventario
export async function getInventory() {
    try {
        const response = await axios.get('/inventory/');
        
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_item`
        const formattedData = response.data.map(item => ({
            ...formatDataInventory(item),
        }));
        return formattedData;
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
        return { error: error.message || 'Error al obtener el inventario' };
    }
}

// Función para obtener un elemento específico del inventario por su ID
export async function getInventoryItem(id_item) {
    try {
        const { data } = await axios.get(`/inventory/view/${id_item}`);
        return {
            ...formatDataInventory(data.data),
            id_item: data.data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener el elemento del inventario' };
    }
}

// Función para crear un nuevo elemento en el inventario
export async function createInventoryItem(inventoryData) {
    try {
        const response = await axios.post('/inventory/add', inventoryData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear el elemento del inventario' };
    }
}

// Función para actualizar un elemento existente en el inventario
export async function updateInventoryItem(id_item, inventoryData) {
    try {
        const response = await axios.patch(`/inventory/edit/${id_item}`, inventoryData);
        if (!response.data || typeof response.data !== 'object') {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }
        console.log('Datos de inventario actualizados correctamente:', response.data);

        // Validar si el servidor devuelve correctamente el item actualizado
        const updatedItem = response.data.item || response.data;
        if (!updatedItem.id_item && !updatedItem.id) {
            throw new Error('El elemento actualizado no está presente en la respuesta del servidor');
        }

        // Verificar y formatear los datos devueltos
        return {
            ...updatedItem,
            id_item: updatedItem.id_item || updatedItem.id || id_item, // Usar id_item o id según lo que devuelva la API
        };
    } catch (error) {
        console.error('Error en updateInventoryItem:', error);
        throw error;
    }
}

// Función para eliminar un elemento del inventario
export async function deleteInventoryItem(id_item) {
    try {
        const response = await axios.delete(`/inventory/delete/${id_item}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar el elemento del inventario' };
    }
}
