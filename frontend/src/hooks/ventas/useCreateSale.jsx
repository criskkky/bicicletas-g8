import { useState } from 'react';
import { createSale } from '@services/ventas.service.js';

const useCreateSale = (setSales) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newSaleData) => {
        // Validar estructura de los datos
        if (!newSaleData || 
            !newSaleData.rut_trabajador || 
            !newSaleData.rut_cliente || 
            !newSaleData.fecha_venta) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear la venta
            const response = await createSale(newSaleData);

            if (response) {
                // Agregar la venta creada a la lista existente
                setSales(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear venta");
            console.error("Error al crear venta:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateSale;
