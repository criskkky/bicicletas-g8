import { useState } from 'react';
import { createOrder } from '@services/orden.service.js';

const useCreateOrder = (setOrders) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newOrderData) => {
        // Validar estructura de los datos
        if (!newOrderData || 
            !newOrderData.rut_trabajador || 
            !newOrderData.fecha_orden || 
            !newOrderData.tipo_orden || 
            !newOrderData.total) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear la orden
            const response = await createOrder(newOrderData);

            if (response) {
                // Agregar la orden creada a la lista existente
                setOrders(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear la orden");
            console.error("Error al crear la orden:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateOrder;
