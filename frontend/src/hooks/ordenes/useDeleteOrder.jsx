import { deleteOrder } from '@services/orden.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteOrder = (fetchOrders, setDataOrder) => {
    const handleDelete = async (dataOrder) => {
        if (!dataOrder || dataOrder.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ninguna orden para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); // Confirmación del usuario
            if (result.isConfirmed) {
                const response = await deleteOrder(dataOrder[0].id_orden); // Usar id_orden

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'La orden ha sido eliminada correctamente.');
                await fetchOrders(); // Actualiza la lista de órdenes
                setDataOrder([]); // Limpia la selección
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar la orden:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar la orden.');
        }
    };

    return { handleDelete };
};

export default useDeleteOrder;
