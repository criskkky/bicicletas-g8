import { useState } from 'react';
import { createInvoice } from '@services/facturas.service.js';

const useCreateInvoice = (setInvoices) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newInvoiceData) => {
        // Validar estructura de los datos
        if (!newInvoiceData || 
            !newInvoiceData.rut_trabajador || 
            !newInvoiceData.rut_cliente || 
            !newInvoiceData.fecha_factura || 
            !newInvoiceData.total || 
            !newInvoiceData.metodo_pago ) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear la factura
            const response = await createInvoice(newInvoiceData);

            if (response) {
                // Agregar la factura creada a la lista existente
                setInvoices(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear la factura");
            console.error("Error al crear la factura:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateInvoice;
