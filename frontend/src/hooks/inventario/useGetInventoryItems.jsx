import { useState, useEffect } from 'react';
import { getInventoryItems } from '@services/inventario.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetInventoryItems = () => {
    const [inventoryItems, setInventoryItems] = useState([]);

    const formatInventoryData = (item) => ({
        id_item: item.id_item,
        nombre: item.nombre || 'Nombre no disponible',
        marca: item.marca || 'Marca no disponible',
        descripcion: item.descripcion || 'Descripción no disponible',
        precio: item.precio != null ? item.precio : 'Precio no disponible',
        stock: item.stock != null ? item.stock : 'Stock no disponible',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    });

    const fetchInventoryItems = async () => {
        try {
            const response = await getInventoryItems();
            console.log(response); // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de inventario.");
            }

            const formattedData = response.map(formatInventoryData);
            setInventoryItems(formattedData);
        } catch (error) {
            console.error("Error al obtener los datos del inventario: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos del inventario.");
        }
    };

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    return { inventoryItems, fetchInventoryItems, setInventoryItems };
};

export default useGetInventoryItems;
