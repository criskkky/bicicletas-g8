import { useState } from 'react';
import { createInventoryItem } from '@services/inventario.service.js';

const useCreateInventory = (setInventoryItems) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newInventoryData) => {
        // Validar estructura de los datos
        if (!newInventoryData || 
            !newInventoryData.nombre || 
            !newInventoryData.marca || 
            !newInventoryData.descripcion || 
            newInventoryData.precio == null || 
            newInventoryData.stock == null) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear un nuevo ítem en el inventario
            const response = await createInventoryItem(newInventoryData);

            if (response) {
                // Agregar el ítem creado a la lista existente
                setInventoryItems(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear ítem en el inventario");
            console.error("Error al crear ítem en el inventario:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateInventory;
