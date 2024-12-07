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
                const items = maintenance.inventoryItems?.map(item => ({
                    id_item: item.inventory_id,
                    cantidad: item.quantityUsed,
                })) || []; // Asegura que sea un array incluso si no hay items

                return {
                    id_mantenimiento: maintenance.id,
                    descripcion: maintenance.description,
                    rut_trabajador: maintenance.technician, // Se espera que sea el RUT
                    rut_cliente: maintenance.client, // Se espera que sea el RUT
                    fecha_mantenimiento: maintenance.date,
                    items, // Mantiene el array de objetos
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
