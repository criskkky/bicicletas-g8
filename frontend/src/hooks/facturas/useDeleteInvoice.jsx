import { deleteInvoice } from '@services/facturas.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteInvoice = (fetchInvoices, setDataInvoice) => {
    const handleDelete = async (dataInvoice) => {
        if (!dataInvoice || dataInvoice.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ninguna factura para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); // Confirmación del usuario
            if (result.isConfirmed) {
                const response = await deleteInvoice(dataInvoice[0].id_factura); // Usar id_factura

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'La factura ha sido eliminada correctamente.');
                await fetchInvoices(); // Actualiza la lista de facturas
                setDataInvoice([]); // Limpia la selección
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar la factura:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar la factura.');
        }
    };

    return { handleDelete };
};

export default useDeleteInvoice;
