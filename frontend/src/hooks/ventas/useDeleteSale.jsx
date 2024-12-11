import { deleteSale } from '@services/ventas.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteSale = (fetchSales, setSale) => {
    const handleDelete = async (salesToDelete) => {
        if (!salesToDelete || salesToDelete.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ninguna venta para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); // Confirmación del usuario
            if (result.isConfirmed) {
                const response = await deleteSale(salesToDelete[0].id_venta); // Usar id_venta

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'La venta ha sido eliminada correctamente.');
                await fetchSales(); // Actualiza la lista de ventas
                setSale({}); // Limpia la selección
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar la venta.');
        }
    };

    return { handleDelete };
};

export default useDeleteSale;
