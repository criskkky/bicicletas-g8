import { useState, useEffect } from 'react';
import { getMaintenances } from '@services/mantenimiento.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetMaintenances = () => {
    const [maintenances, setMaintenances] = useState([]);

    const formatMaintenanceData = (maintenance) => {
        const items = Array.isArray(maintenance.items)
            ? maintenance.items.map(item => `ID: ${item.id_item}, Cantidad: ${item.cantidad}`).join(', ')
            : "N/A";
    
        return {
            id_mantenimiento: maintenance.id_mantenimiento,
            descripcion: maintenance.descripcion || 'Descripción no disponible',
            rut_trabajador: maintenance.rut_trabajador,
            rut_cliente: maintenance.rut_cliente,
            fecha_mantenimiento: maintenance.fecha_mantenimiento,
            items,
            createdAt: maintenance.createdAt,
            updatedAt: maintenance.updatedAt,
        };
    };
    
    const fetchMaintenances = async () => {
        try {
            const response = await getMaintenances();
            console.log(response);  // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de mantenimientos.");
            }

            const formattedData = response.map(formatMaintenanceData);
            setMaintenances(formattedData);
        } catch (error) {
            console.error("Error al obtener los mantenimientos: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos de mantenimiento.");
        }
    };

    useEffect(() => {
        fetchMaintenances();
    }, []);

    return { maintenances, fetchMaintenances, setMaintenances };
};

export default useGetMaintenances;
