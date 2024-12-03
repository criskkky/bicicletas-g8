import { useState, useEffect } from 'react';
import { getMaintenances } from '@services/mantenimiento.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetMaintenances = () => {
    const [maintenances, setMaintenances] = useState([]);

    const fetchMaintenances = async () => {
        try {
            const response = await getMaintenances();

            // Verifica si la respuesta es un array válido
            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de mantenimientos.");
            }

            // Formatear los datos
            const formattedData = response.map(maintenance => {
                let inventoryDetails;
                if (maintenance.inventoryItems && maintenance.inventoryItems.length > 0) {
                    // Si inventoryItems existe, extraemos los ids y las cantidades
                    inventoryDetails = maintenance.inventoryItems.map(item => {
                        return `ID: ${item.inventory_id} (Cantidad: ${item.quantityUsed})`;  // Cambiado a claves correctas
                    }).join(', ');  // Unir los elementos con una coma
                } else {
                    inventoryDetails = 'N/A';  // Si no existen items, retorna 'N/A'
                }

                return {
                    id: maintenance.id,
                    description: maintenance.description,
                    technician: maintenance.technician,
                    status: maintenance.status,
                    date: maintenance.date,
                    inventoryItems: inventoryDetails,  // Muestra los detalles como un string
                    createdAt: maintenance.createdAt,
                    updatedAt: maintenance.updatedAt,
                };
            });

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
