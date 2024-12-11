import { useState } from 'react';
import { updateInventoryItem } from '@services/inventario.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatInventoryPostUpdate } from '@helpers/formatDataInventory.js';

const useEditInventoryItem = (fetchInventory, setInventoryItems) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [inventoryItem, setInventoryItem] = useState({});

    const handleClickUpdate = () => {
        if (inventoryItem && inventoryItem.id_item) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedInventoryData) => {
        if (updatedInventoryData && updatedInventoryData.id_item) {
            try {
                console.log('Datos a actualizar:', updatedInventoryData);
                const updatedItem = await updateInventoryItem(updatedInventoryData.id_item, updatedInventoryData);

                console.log('Artículo actualizado:', updatedItem);

                showSuccessAlert('¡Actualizado!', 'El artículo del inventario ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                const formattedItem = formatInventoryPostUpdate(updatedItem);

                setInventoryItems(prevItems => prevItems.map(item => 
                    item.id_item === formattedItem.id_item
                        ? { ...formattedItem }
                        : item
                ));

                await fetchInventory();
                setInventoryItem({});
            } catch (error) {
                console.error('Error al actualizar el artículo:', error);
                showErrorAlert('Error', `Ocurrió un error al actualizar el artículo: ${error.message}`);
            }
        } else {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID del artículo');
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        inventoryItem,
        setInventoryItem
    };
};

export default useEditInventoryItem;
