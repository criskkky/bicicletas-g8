import { deletePayment } from '@services/pagos.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeletePayment = (fetchPayments, setPayments) => {
  const handleDeletePayment = async (paymentId) => {
    if (!paymentId) {
      showErrorAlert('Error', 'No se seleccionó ningún pago para eliminar.');
      return;
    }

    try {
      // Confirmación del usuario antes de eliminar
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deletePayment(paymentId);

        if (response.error) {
          throw new Error(response.error);
        }

        // Mostrar alerta de éxito
        showSuccessAlert('¡Eliminado!', 'El pago ha sido eliminado correctamente.');

        // Actualizar la lista de pagos localmente
        setPayments((prevState) => prevState.filter((payment) => payment.id_pago !== paymentId));

        // Refrescar la lista de pagos si es necesario
        if (fetchPayments) await fetchPayments();
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
      }
    } catch (error) {
      console.error('Error al eliminar el pago:', error);
      showErrorAlert('Error', error.message || 'Ocurrió un error al eliminar el pago.');
    }
  };

  return { handleDeletePayment };
};

export default useDeletePayment;