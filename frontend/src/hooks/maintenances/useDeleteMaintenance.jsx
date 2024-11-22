import { deleteMaintenance } from '@services/maintenance.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteMaintenance = (fetchMaintenances, setDataMaintenance) => {
    const handleDelete = async (dataMaintenance) => {
        if (dataMaintenance.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deleteMaintenance(dataMaintenance[0].id);
                    if(response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    showSuccessAlert('¡Eliminado!','El mantenimiento ha sido eliminado correctamente.');
                    await fetchMaintenances();
                    setDataMaintenance([]);
                    window.location.reload();
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el mantenimiento:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el mantenimiento.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeleteMaintenance;