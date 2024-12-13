import { useState } from 'react';
import { updatePayment } from '@services/pagos.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPaymentPostUpdate } from '@helpers/formatDataPayment.js';

const useEditPayment = (fetchPayments, setPayments) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPayment, setDataPayment] = useState({});

    const handleClickUpdate = () => {
        if (dataPayment && dataPayment.id_pago) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedPaymentData) => {
        if (updatedPaymentData && updatedPaymentData.id_pago) {
            try {
                console.log('Datos a actualizar:', updatedPaymentData);
                const updatedPayment = await updatePayment(updatedPaymentData.id_pago, updatedPaymentData);

                console.log('Pago actualizado:', updatedPayment);

                showSuccessAlert('¡Actualizado!', 'El pago ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                const formattedPayment = formatPaymentPostUpdate(updatedPayment);

                setPayments(prevPayments => prevPayments.map(payment => 
                    payment.id_pago === formattedPayment.id_pago
                        ? { ...formattedPayment }
                        : payment
                ));

                await fetchPayments();
                setDataPayment({});
            } catch (error) {
                console.error('Error al actualizar el pago:', error);
                showErrorAlert('Error', `Ocurrió un error al actualizar el pago: ${error.message}`);
            }
        } else {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID del pago');
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
