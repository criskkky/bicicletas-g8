import { useState } from 'react';
import { updatePayment } from '@services/pagos.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useEditPayment = (fetchPayments, setPayments) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPayment, setDataPayment] = useState({});

    const handleEditPayment = async (updatedPaymentData) => {
        if (!updatedPaymentData || !updatedPaymentData.id_pago) {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID del pago');
            return;
        }

        try {
            console.log('Datos a actualizar:', updatedPaymentData);

            // Llamada al servicio para actualizar el pago
            const response = await updatePayment(updatedPaymentData.id_pago, updatedPaymentData);

            if (!response || !response.pago) {
                throw new Error('La respuesta del servidor no contiene los datos esperados');
            }

            const { pago } = response;

            console.log('Pago actualizado:', pago);

            showSuccessAlert('¡Actualizado!', 'El pago ha sido actualizado correctamente.');
            setIsPopupOpen(false);

            // Actualizar la lista de pagos
            setPayments((prevPayments) =>
                prevPayments.map((existingPayment) =>
                    existingPayment.id_pago === pago.id_pago ? pago : existingPayment
                )
            );

            // Refrescar pagos y limpiar estado local
            await fetchPayments();
            setDataPayment({});
        } catch (error) {
            console.error('Error al actualizar el pago:', error);
            showErrorAlert('Error', `Ocurrió un error al actualizar el pago: ${error.message}`);
        }
    };

    return {
        handleEditPayment,
        dataPayment,
        setDataPayment,
        isPopupOpen,
        setIsPopupOpen,
    };
};

export default useEditPayment;
