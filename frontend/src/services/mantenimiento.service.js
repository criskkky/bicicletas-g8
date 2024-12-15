import axios from './root.service.js';
import { formatMaintenanceDataGet } from '@helpers/formatDataMaintenance.js';

// Función para obtener todos los mantenimientos
export async function getMaintenances() {
    try {
        const response = await axios.get('/maintenance/');
        
        if (!response || !response.data) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }

        // Formatea los datos para incluir `id_mantenimiento`
        const formattedData = response.data.map(maintenance => ({
            ...formatMaintenanceDataGet(maintenance),
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
            ...formatMaintenanceDataGet(data.data),
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

        console.log('Datos de mantenimiento actualizados correctamente:', response.data);

        // Validar que los datos esenciales estén presentes
        const { maintenance, invoice, order } = response.data;

        // Validar estructura y tipos de datos
        if (
            !maintenance ||
            typeof maintenance.id_mantenimiento !== 'number' ||
            typeof maintenance.rut_trabajador !== 'string' ||
            typeof maintenance.rut_cliente !== 'string' ||
            typeof maintenance.descripcion !== 'string' ||
            !Array.isArray(maintenance.items)
        ) {
            throw new Error('La respuesta del servidor no cumple con la estructura esperada (maintenance).');
        }

        if (
            !invoice ||
            typeof invoice.id_factura !== 'number' ||
            typeof invoice.total !== 'number' ||
            typeof invoice.rut_cliente !== 'string'
        ) {
            throw new Error('La respuesta del servidor no cumple con la estructura esperada (invoice).');
        }

        if (
            !order ||
            typeof order.id_orden !== 'number' ||
            typeof order.total !== 'number' ||
            typeof order.estado_orden !== 'string'
        ) {
            throw new Error('La respuesta del servidor no cumple con la estructura esperada (order).');
        }

        // Retorna los datos validados
        return { maintenance, invoice, order };
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