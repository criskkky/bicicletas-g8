import { deletePayment } from '@services/pagos.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeletePayment = (fetchPayments, setDataPayment) => {
    const handleDelete = async (dataPayment) => {
        if (!dataPayment || dataPayment.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ningún pago para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); // Confirmación del usuario
            if (result.isConfirmed) {
                const response = await deletePayment(dataPayment[0].id_pago); // Usar id_pago

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'El pago ha sido eliminado correctamente.');
                await fetchPayments(); // Actualiza la lista de pagos
                setDataPayment([]); // Limpia la selección
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el pago:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar el pago.');
        }
    };

    return { handleDelete };
};

export default useDeletePayment;
