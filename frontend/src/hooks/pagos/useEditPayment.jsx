import { useState } from 'react';
import { updatePayment } from '@services/pagos.service.js'; // Servicio adaptado para pagos
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPaymentPostUpdate } from '@helpers/formatDataPayment.js'; // Helper para formatear los datos de pagos

const useEditPayment = (setPayments) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPayment, setDataPayment] = useState({}); // Cambiado de [] a {}

    const handleClickUpdate = () => {
        if (dataPayment && dataPayment.id) { // Verifica si 'dataPayment' tiene 'id'
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedPaymentData) => {
        if (updatedPaymentData && dataPayment && dataPayment.id) { // Verifica que 'dataPayment' tenga 'id'
            try {
                // Primero el ID del pago, luego los datos a actualizar
                const updatedPayment = await updatePayment(dataPayment.id, updatedPaymentData);
                showSuccessAlert('¡Actualizado!', 'El pago ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                const formattedPayment = formatPaymentPostUpdate(updatedPayment);

                setPayments(prevPayments => prevPayments.map(payment => {
                    return payment.id === formattedPayment.id ? formattedPayment : payment;
                }));

                setDataPayment({}); // Limpiar datos después de la actualización
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar el pago:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el pago.');
            }
        } else {
            console.error("No se puede actualizar: 'dataPayment' no tiene un 'id' válido.");
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPayment,
        setDataPayment
    };
};

export default useEditPayment;
