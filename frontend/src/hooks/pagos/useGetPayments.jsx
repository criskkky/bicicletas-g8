import { useState, useEffect } from 'react';
import { getPayments } from '@services/pagos.service.js'; // Servicio adaptado para pagos
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetPayments = () => {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        try {
            const response = await getPayments();

            // Verifica si la respuesta es un array válido
            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de pagos.");
            }

            // Formatear los datos
            const formattedData = response.map(payment => ({
                id: payment.id,
                idCliente: payment.idCliente,
                idTecnico: payment.idTecnico,
                monto: payment.monto,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            }));

            setPayments(formattedData);
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return { payments, fetchPayments, setPayments };
};

export default useGetPayments;
