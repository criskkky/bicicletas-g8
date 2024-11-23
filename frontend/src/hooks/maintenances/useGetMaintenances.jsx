import { useState, useEffect } from 'react';
import { getMaintenances } from '@services/maintenance.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';


const useGetMaintenances = () => {
    const [maintenances, setMaintenances] = useState([]);

    const fetchMaintenances = async () => {
        try {
            const response = await getMaintenances();
            
            // Verifica si la respuesta tiene los datos esperados
            if ( !Array.isArray(response) ) {
                return showWarningAlert("¡Advertencia!", "No existen registros de mantenimientos.");
            }
    
            // Formatear los datos
            const formattedData = response.map(maintenance => ({
                id: maintenance.id,
                description: maintenance.description,
                technician: maintenance.technician,
                status: maintenance.status,
                date: maintenance.date,
                idItemUsed: maintenance.idItemUsed,
                quantityUsed: maintenance.quantityUsed,
                createdAt: maintenance.createdAt,
                updatedAt: maintenance.updatedAt
            }));
            setMaintenances(formattedData);
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    useEffect(() => {
        fetchMaintenances();
    }, []);

    return { maintenances, fetchMaintenances, setMaintenances };
};

export default useGetMaintenances;