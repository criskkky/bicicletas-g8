import { useState } from 'react';
import { updateMaintenance } from '@services/mantenimiento.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatMaintenancePostUpdate } from '@helpers/formatDataMaintenance.js';

const useEditMaintenance = (fetchMaintenances, setMaintenances) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMaintenance, setDataMaintenance] = useState({});

    const handleClickUpdate = () => {
        if (dataMaintenance && dataMaintenance.id_mantenimiento) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedMaintenanceData) => {
        if (updatedMaintenanceData && updatedMaintenanceData.id_mantenimiento) {
            try {
                console.log('Datos a actualizar:', updatedMaintenanceData);
                const updatedMaintenance = await updateMaintenance(updatedMaintenanceData.id_mantenimiento, updatedMaintenanceData);

                console.log('Mantenimiento actualizado:', updatedMaintenance);

                showSuccessAlert('¡Actualizado!', 'El mantenimiento ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                const formattedMaintenance = formatMaintenancePostUpdate(updatedMaintenance);

                setMaintenances(prevMaintenances => prevMaintenances.map(maintenance => 
                    maintenance.id_mantenimiento === formattedMaintenance.id_mantenimiento
                        ? { ...formattedMaintenance, items: updatedMaintenance.items }
                        : maintenance
                ));

                await fetchMaintenances();
                setDataMaintenance({});
            } catch (error) {
                console.error('Error al actualizar el mantenimiento:', error);
                showErrorAlert('Error', `Ocurrió un error al actualizar el mantenimiento: ${error.message}`);
            }
        } else {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID de mantenimiento');
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

