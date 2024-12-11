import { deleteInventoryItem } from '@services/inventario.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteInventoryItem = (fetchInventory, setSelectedItems) => {
    const handleDelete = async (inventoryItems) => {
        if (!inventoryItems || inventoryItems.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ningún artículo para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); // Confirmación del usuario
            if (result.isConfirmed) {
                const response = await deleteInventoryItem(inventoryItems[0].id_item); // Usar id_item

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'El artículo ha sido eliminado correctamente.');
                await fetchInventory(); // Actualiza la lista de artículos
                setSelectedItems([]); // Limpia la selección
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar el artículo.');
        }
    };

    return { handleDelete };
};

export default useDeleteInventoryItem;
