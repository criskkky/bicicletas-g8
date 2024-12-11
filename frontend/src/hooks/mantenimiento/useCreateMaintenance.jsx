import { useState } from 'react';
import { createMaintenance } from '@services/mantenimiento.service.js';

const useCreateMaintenance = (setMaintenances) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newMaintenanceData) => {
        // Validar estructura de los datos
        if (!newMaintenanceData || 
            !newMaintenanceData.rut_trabajador || 
            !newMaintenanceData.rut_cliente || 
            !newMaintenanceData.fecha_mantenimiento ||
            !newMaintenanceData.descripcion ) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear el mantenimiento
            const response = await createMaintenance(newMaintenanceData);

            if (response) {
                // Agregar el mantenimiento creado a la lista existente
                setMaintenances(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear mantenimiento");
            console.error("Error al crear mantenimiento:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateMaintenance;
