import { useState } from 'react';
import { updateMaintenance } from '@services/maintenance.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatMaintenancePostUpdate } from '@helpers/formatDataMaintenance.js';

const useEditMaintenance = (setMaintenances) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataMaintenance, setDataMaintenance] = useState({});  // Cambiado de [] a {}

    const handleClickUpdate = () => {
        if (dataMaintenance && dataMaintenance.id) {  // Verifica si 'dataMaintenance' tiene 'id'
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedMaintenanceData) => {
        if (updatedMaintenanceData && dataMaintenance && dataMaintenance.id) {  // Verifica que 'dataMaintenance' tenga 'id'
            try {
                // Primero el ID del mantenimiento, luego los datos a actualizar
                const updatedMaintenance = await updateMaintenance(dataMaintenance.id, updatedMaintenanceData);
                showSuccessAlert('¡Actualizado!', 'El mantenimiento ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                const formattedMaintenance = formatMaintenancePostUpdate(updatedMaintenance);
    
                setMaintenances(prevMaintenances => prevMaintenances.map(maintenance => {
                    return maintenance.id === formattedMaintenance.id ? formattedMaintenance : maintenance;
                }));
    
                setDataMaintenance({});  // Limpiar datos después de la actualización
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar el mantenimiento:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el mantenimiento.');
            }
        } else {
            console.error("No se puede actualizar: 'dataMaintenance' no tiene un 'id' válido.");
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
