import { deleteInventoryItem } from '@services/inventario.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteInventory = (fetchInventory, setDataInventory) => {
    const handleDelete = async (dataInventory) => {
        if (dataInventory.length > 0) {
            try {
                const result = await deleteDataAlert();
                
                if (result.isConfirmed) {
                    const response = await deleteInventoryItem(dataInventory[0].id);
                    
                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    
                    showSuccessAlert('¡Eliminado!', 'El item del inventario ha sido eliminado correctamente.');
                    
                    await fetchInventory();
                    setDataInventory([]);
                    window.location.reload();
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el item del inventario:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el item del inventario.');
            }
        }
    };

    return { handleDelete };
};

export default useDeleteInventory;
