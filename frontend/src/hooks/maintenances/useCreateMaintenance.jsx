import { useState } from 'react';
import { createMaintenance } from '@services/maintenance.service.js'; // Este servicio debe ser creado para manejar la solicitud

const useCreateMaintenance = (setMaintenances) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newMaintenanceData) => {
        setLoading(true);
        setError(null); // Limpiar errores previos
        try {
            const response = await createMaintenance(newMaintenanceData); // Llamada al servicio para crear el mantenimiento
            if (response) {
                // Al crear el mantenimiento, se obtiene la lista actualizada
                setMaintenances(prevState => [...prevState, response]); // Agregar el mantenimiento creado a la lista existente
                window.location.reload();
            }
        } catch (error) {
            setError(error); // Manejo de errores
            console.error("Error al crear mantenimiento:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateMaintenance;
