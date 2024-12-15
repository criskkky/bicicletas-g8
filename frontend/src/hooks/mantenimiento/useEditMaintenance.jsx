import { useState } from 'react';
import { updateMaintenance } from '@services/mantenimiento.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

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
    
                // Llamada al servicio para actualizar el mantenimiento
                const response = await updateMaintenance(
                    updatedMaintenanceData.id_mantenimiento,
                    updatedMaintenanceData
                );
    
                if (!response || !response.maintenance) {
                    throw new Error('La respuesta del servidor no contiene los datos esperados');
                }
    
                const { maintenance, invoice, order } = response;
    
                console.log('Mantenimiento actualizado:', { maintenance, invoice, order });
    
                showSuccessAlert(
                    '¡Actualizado!',
                    'El mantenimiento ha sido actualizado correctamente.'
                );
                setIsPopupOpen(false);
    
                // Actualizar la lista de mantenimientos
                setMaintenances((prevMaintenances) =>
                    prevMaintenances.map((existingMaintenance) =>
                        existingMaintenance.id_mantenimiento === maintenance.id_mantenimiento
                            ? { ...maintenance, items: maintenance.items || [] }
                            : existingMaintenance
                    )
                );
    
                // Refrescar mantenimientos y limpiar estado local
                await fetchMaintenances();
                setDataMaintenance({});
            } catch (error) {
                console.error('Error al actualizar el mantenimiento:', error);
                showErrorAlert(
                    'Error',
                    `Ocurrió un error al actualizar el mantenimiento: ${error.message}`
                );
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
        setDataMaintenance,
    };
};

export default useEditMaintenance;
