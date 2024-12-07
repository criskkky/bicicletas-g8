import axios from './root.service.js';
import { formatDataMaintenance } from '@helpers/formatDataMaintenance.js';

// Función para obtener todos los mantenimientos
export async function getMaintenances() {
    try {
        const response = await axios.get('/maintenance/');
        console.log('Respuesta de la API:', response);

        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_mantenimiento`
        const formattedData = response.data.map(maintenance => ({
            ...formatDataMaintenance(maintenance),
            id_mantenimiento: maintenance.id, // Asigna el ID correcto
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
        const response = await axios.patch(`/maintenance/edit/${id_mantenimiento}`, maintenanceData);
        return {
            ...response.data,
            id_mantenimiento: response.data.id, // Asegura la consistencia
        };
    } catch (error) {
        return error.response?.data || { error: 'Error al actualizar el mantenimiento' };
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
