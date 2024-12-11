import axios from './root.service.js';
import { formatDataMaintenance } from '@helpers/formatDataMaintenance.js';

// Función para obtener todos los mantenimientos
export async function getMaintenances() {
    try {
        const response = await axios.get('/maintenance/');
        
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_mantenimiento`
        const formattedData = response.data.map(maintenance => ({
            ...formatDataMaintenance(maintenance),
        }));
        return formattedData;
    } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
        return { error: error.message || 'Error al obtener los mantenimientos' };
    }
}

// Función para obtener un mantenimiento específico por su ID
export async function getMaintenance(id_mantenimiento) {
    try {
        const { data } = await axios.get(`/maintenance/view/${id_mantenimiento}`);
        return {
            ...formatDataMaintenance(data.data),
            id_mantenimiento: data.data.id, // Asegura que el campo esté alineado con el MER
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al obtener el mantenimiento' };
    }
}

// Función para crear un nuevo mantenimiento
export async function createMaintenance(maintenanceData) {
    try {
        const response = await axios.post('/maintenance/add', maintenanceData);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al crear el mantenimiento' };
    }
}

// Función para actualizar un mantenimiento existente
export async function updateMaintenance(id_mantenimiento, maintenanceData) {
    try {
        // Asegúrate de que los items estén incluidos en maintenanceData
        const { items, ...restData } = maintenanceData;
        const dataToSend = {
            ...restData,
            items: items.map(item => ({
                id_item: item.id_item,
                cantidad: parseInt(item.cantidad, 10)
            }))
        };

        const response = await axios.patch(`/maintenance/edit/${id_mantenimiento}`, dataToSend);
        console.log('Datos de mantenimiento actualizados:', response.data);
        
        if (!response.data || !response.data.maintenance) {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }
        
        // Asumimos que el servidor devuelve el mantenimiento actualizado en response.data.maintenance
        const updatedMaintenance = response.data.maintenance;
        
        // Aseguramos que id_mantenimiento esté presente y que los items estén incluidos
        return {
            ...updatedMaintenance,
            id_mantenimiento: updatedMaintenance.id || id_mantenimiento,
            items: updatedMaintenance.items && updatedMaintenance.items.length > 0 
                ? updatedMaintenance.items 
                : items
        };
    } catch (error) {
        console.error('Error en updateMaintenance:', error);
        throw error;
    }
}

// Función para eliminar un mantenimiento
export async function deleteMaintenance(id_mantenimiento) {
    try {
        const response = await axios.delete(`/maintenance/delete/${id_mantenimiento}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { error: 'Error al eliminar el mantenimiento' };
    }
}

