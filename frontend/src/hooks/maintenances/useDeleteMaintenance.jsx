import { deleteMaintenance } from '@services/mantenimiento.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteMaintenance = (fetchMaintenances, setDataMaintenance) => {
    const handleDelete = async (dataMaintenance) => {
        if (!dataMaintenance || dataMaintenance.length === 0) {
            showErrorAlert('Error', 'No se seleccionó ningún mantenimiento para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert(); // Confirmación del usuario
            if (result.isConfirmed) {
                const response = await deleteMaintenance(dataMaintenance[0].id_mantenimiento); // Usar id_mantenimiento

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'El mantenimiento ha sido eliminado correctamente.');
                await fetchMaintenances(); // Actualiza la lista de mantenimientos
                setDataMaintenance([]); // Limpia la selección
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el mantenimiento:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar el mantenimiento.');
        }
    };

    return { handleDelete };
};

export default useDeleteMaintenance;
