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
        console.log('Datos enviados al backend:', maintenanceData);

        const response = await axios.patch(`/maintenance/edit/${id_mantenimiento}`, maintenanceData);

        if (!response.data || typeof response.data !== 'object') {
            throw new Error('La respuesta del servidor no tiene la estructura esperada');
        }

        console.log('Datos de mantenimiento actualizados correctamente:', response.data);

        const updatedMaintenance = response.data.maintenance || response.data;
        if (!updatedMaintenance.id_mantenimiento && !updatedMaintenance.id) {
            console.error('Respuesta del servidor:', response.data);
            throw new Error('El mantenimiento actualizado no está presente en la respuesta del servidor');
        }

        return {
            ...updatedMaintenance,
            id_mantenimiento: updatedMaintenance.id_mantenimiento || updatedMaintenance.id || id_mantenimiento,
            items: updatedMaintenance.items || maintenanceData.items,
        };
    } catch (error) {
        console.error('Error en updateMaintenance:', error.response?.data || error.message);
        console.log('Datos enviados:', maintenanceData);
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