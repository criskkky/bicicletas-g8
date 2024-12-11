import axios from './root.service.js';
import { formatDataInventory } from '@helpers/formatDataInventory.js';

// Función para obtener todos los artículos del inventario
export async function getInventoryItems() {
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
        console.error("Error al obtener los datos del inventario:", error);
        return { error: error.message || 'Error al obtener los datos del inventario' };
    }
}

// Función para obtener un artículo específico del inventario por su ID
export async function getInventoryItem(id_item) {
    try {
        const { data } = await axios.get(`/inventory/view/${id_item}`);
        return {
            ...formatDataInventory(data.data),
            id_item: data.data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener el artículo del inventario' };
    }
}

// Función para crear un nuevo artículo en el inventario
export async function createInventoryItem(itemData) {
    try {
        const response = await axios.post('/inventory/add', itemData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear el artículo del inventario' };
    }
}

// Función para actualizar un artículo existente en el inventario
export async function updateInventoryItem(id_item, itemData) {
    try {
        const response = await axios.patch(`/inventory/edit/${id_item}`, itemData);
        console.log('Datos del inventario actualizados:', response.data);
        
        if (!response.data || !response.data.item) {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }
        
        // Asumimos que el servidor devuelve el artículo actualizado en response.data.item
        const updatedItem = response.data.item;

        // Aseguramos que id_item esté presente
        return {
            ...updatedItem,
            id_item: updatedItem.id || id_item,
        };
    } catch (error) {
        console.error('Error en updateInventoryItem:', error);
        throw error;
    }
}

// Función para eliminar un artículo del inventario
export async function deleteInventoryItem(id_item) {
    try {
        const response = await axios.delete(`/inventory/delete/${id_item}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar el artículo del inventario' };
    }
}
