import { useState, useEffect } from 'react';
import { getMaintenances } from '@services/mantenimiento.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetMaintenances = () => {
    const [maintenances, setMaintenances] = useState([]);

    const fetchMaintenances = async () => {
        try {
            const response = await getMaintenances();
            console.log(response);  // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de mantenimientos.");
            }

            setMaintenances(response);
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
