import { useState } from 'react';
import { createSale } from '@services/ventas.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateSale = (fetchSales, setSales) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newSaleData) => {
        // Validar estructura de los datos
        if (
            !newSaleData ||
            !newSaleData.rut_trabajador ||
            !newSaleData.rut_cliente ||
            !newSaleData.fecha_venta
        ) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear una nueva venta
            const response = await createSale(newSaleData);

            if (response) {
                showSuccessAlert('¡Creado!', 'La venta ha sido creada correctamente.');
                await fetchSales(); // Actualiza la lista de ventas
                setSales((prevSales) => [...prevSales, { ...response }]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear la venta");
            console.error("Error al crear la venta:", error);
            showErrorAlert('Error', 'Ocurrió un error al crear la venta.');
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateSale;
