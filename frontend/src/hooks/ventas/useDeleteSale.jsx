import { deleteSale } from '@services/ventas.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteSale = (fetchSales, setDataSale) => {
    const handleDelete = async (dataSale) => {
        if (!dataSale || dataSale.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ninguna venta para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); 
            if (result.isConfirmed) {
                const response = await deleteSale(dataSale[0].id_venta); 

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'La venta ha sido eliminada correctamente.');
                await fetchSales(); 
                setDataSale([]); 
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
