import axios from './root.service.js'; // Asegúrate de que root.service.js esté correctamente configurado
import { formatDataMaintenance } from '@helpers/formatDataMaintenance.js'; // Importa el helper para formatear los datos

// Función para obtener todos los mantenimientos
export async function getMaintenances() {
    try {
        const response = await axios.get('/maintenance/');
        console.log('Respuesta de la API:', response);  // Ver la respuesta completa

        // Verifica que la propiedad 'data' esté presente y contiene los elementos esperados
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatear los datos de mantenimiento utilizando el helper
        const formattedData = response.data.map(formatDataMaintenance); // Usa directamente response.data
        return formattedData;
    } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
        return { error: error.message || 'Error al obtener los mantenimientos' }; // Mensaje de error más claro
    }
}

// Función para obtener un mantenimiento específico por su ID
export async function getMaintenance(maintenanceId) {
    try {
        const { data } = await axios.get(`/maintenance/view/${maintenanceId}`);
        return formatDataMaintenance(data.data); // Formatear el mantenimiento específico
    } catch (error) {
        return error.response.data;
    }
}

// Función para crear un nuevo mantenimiento
export async function createMaintenance(maintenanceData) {
    try {
        const response = await axios.post('/maintenance/add', maintenanceData);
        return response.data; // Retorna el mantenimiento creado
    } catch (error) {
        return error.response.data;
    }
}

// Función para actualizar un mantenimiento existente
export async function updateMaintenance(maintenanceId, maintenanceData) {
    try {
        const response = await axios.patch(`/maintenance/edit/${maintenanceId}`, maintenanceData);
        return response.data; // Retorna el mantenimiento actualizado
    } catch (error) {
        return error.response.data;
    }
}

// Función para eliminar un mantenimiento
export async function deleteMaintenance(maintenanceId) {
    try {
        const response = await axios.delete(`/maintenance/delete/${maintenanceId}`);
        return response.data; // Retorna la respuesta del servidor
    } catch (error) {
        return error.response.data;
    }
}
