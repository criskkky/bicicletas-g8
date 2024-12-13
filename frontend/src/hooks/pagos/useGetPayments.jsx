import { useState, useEffect } from 'react';
import { getPayments } from '@services/pagos.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetPayments = () => {
    const [payments, setPayments] = useState([]);

    const formatPaymentData = (payment) => {
        return {
            id_pago: payment.id_pago,
            rut_trabajador: payment.rut_trabajador,
            cantidad_ordenes_realizadas: payment.cantidad_ordenes_realizadas,
            horas_trabajadas: payment.horas_trabajadas,
            fecha_pago: payment.fecha_pago,
            monto: payment.monto,
            estado: payment.estado,
            metodo_pago: payment.metodo_pago,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    };

    const fetchPayments = async () => {
        try {
            const response = await getPayments();
            console.log(response); // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de pagos.");
            }

            const formattedData = response.map(formatPaymentData);
            setPayments(formattedData);
        } catch (error) {
            console.error("Error al obtener los pagos: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos de pagos.");
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return { payments, fetchPayments, setPayments };
};

export default useGetPayments;
