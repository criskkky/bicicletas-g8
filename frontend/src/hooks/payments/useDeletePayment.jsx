import { deletePayment } from '@services/payment.service.js'; // Servicio adaptado para pagos
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeletePayment = (fetchPayments, setDataPayment) => {
    const handleDelete = async (dataPayment) => {
        if (dataPayment.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deletePayment(dataPayment[0].id); // Eliminar usando el ID del primer pago
                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    showSuccessAlert('¡Eliminado!', 'El pago ha sido eliminado correctamente.');
                    await fetchPayments(); // Actualiza la lista de pagos
                    setDataPayment([]); // Limpia el estado del pago seleccionado
                    window.location.reload();
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el pago:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el pago.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeletePayment;
