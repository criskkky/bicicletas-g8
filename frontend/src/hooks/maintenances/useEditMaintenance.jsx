import { useState } from 'react';
import { updateMaintenance } from '@services/mantenimiento.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatMaintenancePostUpdate } from '@helpers/formatDataMaintenance.js';

const useEditMaintenance = (setMaintenances) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMaintenance, setDataMaintenance] = useState({});

    const handleClickUpdate = () => {
        if (dataMaintenance && dataMaintenance.id_mantenimiento) { // Usa el campo correcto
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedMaintenanceData) => {
        if (updatedMaintenanceData && dataMaintenance && dataMaintenance.id_mantenimiento) { // Usa el campo correcto
            try {
                // Actualiza el mantenimiento en el backend
                const updatedMaintenance = await updateMaintenance(dataMaintenance.id_mantenimiento, updatedMaintenanceData);

                showSuccessAlert('¡Actualizado!', 'El mantenimiento ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                // Formatea los datos actualizados
                const formattedMaintenance = formatMaintenancePostUpdate(updatedMaintenance);

                // Actualiza la lista de mantenimientos
                setMaintenances(prevMaintenances => prevMaintenances.map(maintenance => {
                    return maintenance.id_mantenimiento === formattedMaintenance.id_mantenimiento
                        ? formattedMaintenance
                        : maintenance;
                }));

                setDataMaintenance({}); // Limpia el estado
            } catch (error) {
                console.error('Error al actualizar el mantenimiento:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el mantenimiento.');
            }
        } else {
            console.error("No se puede actualizar: 'dataMaintenance' no tiene un 'id_mantenimiento' válido.");
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataMaintenance,
        setDataMaintenance
    };
};

export default useEditMaintenance;
