import { useState } from 'react';
import { createPayment } from '@services/payment.service.js'; // Servicio adaptado para manejar la creación de pagos

const useCreatePayment = (setPayments) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newPaymentData) => {
        setLoading(true);
        setError(null); // Limpiar errores previos
        try {
            const response = await createPayment(newPaymentData); // Llamada al servicio para crear el pago
            if (response) {
                // Al crear el pago, se obtiene la lista actualizada
                setPayments(prevState => [...prevState, response]); // Agregar el pago creado a la lista existente
                window.location.reload();
            }
        } catch (error) {
            setError(error); // Manejo de errores
            console.error("Error al crear pago:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreatePayment;
