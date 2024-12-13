import { useState } from 'react';
import { createInventoryItem } from '@services/inventario.service.js';

const useCreateInventory = (setInventory) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newInventoryData) => {
        // Validar estructura de los datos
        if (!newInventoryData || 
            !newInventoryData.nombre || 
            !newInventoryData.marca || 
            !newInventoryData.precio || 
            !newInventoryData.stock) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear el elemento del inventario
            const response = await createInventoryItem(newInventoryData);

            if (response) {
                // Agregar el elemento creado al inventario existente
                setInventory(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear el elemento del inventario");
            console.error("Error al crear el elemento del inventario:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateInventory;
