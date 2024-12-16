import { useState } from 'react';
import { updateOrder } from '@services/orden.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditOrder = (fetchOrders, setOrders) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataOrder, setDataOrder] = useState({});

    const handleClickUpdate = () => {
        if (dataOrder && dataOrder.id_orden) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedOrderData) => {
        if (updatedOrderData && updatedOrderData.id_orden) {
            try {
                console.log('Datos a actualizar:', updatedOrderData);
                const updatedOrder = await updateOrder(updatedOrderData.id_orden, updatedOrderData);

                console.log('Orden actualizada:', updatedOrder);

                showSuccessAlert('¡Actualizado!', 'La orden ha sido actualizada correctamente.');
                setIsPopupOpen(false);

                setOrders(prevOrders => prevOrders.map(order => 
                    order.id_orden === updatedOrder.id_orden
                        ? { ...updatedOrder }
                        : order
                ));

                await fetchOrders();
                setDataOrder({});
            } catch (error) {
                console.error('Error al actualizar la orden:', error);
                showErrorAlert('Error', `Ocurrió un error al actualizar la orden: ${error.message}`);
            }
        } else {
            showErrorAlert('Error', 'No se puede actualizar: falta el ID de la orden');
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataOrder,
        setDataOrder
    };
};

export default useEditOrder;
