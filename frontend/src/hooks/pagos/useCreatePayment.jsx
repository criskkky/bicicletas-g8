import { useState } from 'react';
import { createPayment } from '@services/pagos.service.js';

const useCreatePayment = (setPayments) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newPaymentData) => {
        // Validar estructura de los datos
        if (!newPaymentData || 
            !newPaymentData.rut_trabajador || 
            !newPaymentData.fecha_pago || 
            !newPaymentData.monto || 
            !newPaymentData.metodo_pago) {
            setError("Datos incompletos. Verifique que todos los campos obligatorios estén presentes.");
            return;
        }

        setLoading(true);
        setError(null); // Limpiar errores previos

        try {
            // Llamada al servicio para crear el pago
            const response = await createPayment(newPaymentData);

            if (response) {
                // Agregar el pago creado a la lista existente
                setPayments(prevState => [
                    ...prevState,
                    { ...response }
                ]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear el pago");
            console.error("Error al crear el pago:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreatePayment;
