import { useState } from 'react';
import { updateInventoryItem } from '@services/inventario.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatInventoryPostUpdate } from '@helpers/formatDataInventory.js';

const useEditInventory = (fetchInventory, setInventory) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataInventory, setDataInventory] = useState({});

    const handleClickUpdate = () => {
        if (dataInventory && dataInventory.id_item) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedInventoryData) => {
        if (updatedInventoryData && updatedInventoryData.id_item) {
            try {
                console.log('Datos a actualizar:', updatedInventoryData);
                const updatedInventory = await updateInventoryItem(updatedInventoryData.id_item, updatedInventoryData);

                console.log('Elemento de inventario actualizado:', updatedInventory);

                showSuccessAlert('¡Actualizado!', 'El elemento del inventario ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                const formattedInventory = formatInventoryPostUpdate(updatedInventory);

                setInventory(prevInventory => prevInventory.map(item => 
                    item.id_item === formattedInventory.id_item
                        ? { ...formattedInventory }
                        : item
                ));

                await fetchInventory();
                setDataInventory({});
            } catch (error) {
                console.error('Error al actualizar el inventario:', error);
                showErrorAlert('Error', `Ocurrió un error al actualizar el inventario: ${error.message}`);
            }
        } else {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID del elemento del inventario');
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataInventory,
        setDataInventory
    };
};

export default useEditInventory;
