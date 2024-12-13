import { useState, useEffect } from 'react';
import { getInventory } from '@services/inventario.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetInventory = () => {
    const [inventory, setInventory] = useState([]);

    const formatInventoryData = (item) => {
        return {
            id_item: item.id_item,
            nombre: item.nombre || 'Nombre no disponible',
            marca: item.marca || 'Marca no disponible',
            descripcion: item.descripcion || 'Descripción no disponible',
            precio: item.precio,
            stock: item.stock,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    };

    const fetchInventory = async () => {
        try {
            const response = await getInventory();
            console.log(response); // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de inventario.");
            }

            const formattedData = response.map(formatInventoryData);
            setInventory(formattedData);
        } catch (error) {
            console.error("Error al obtener el inventario: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos del inventario.");
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return { inventory, fetchInventory, setInventory };
};

export default useGetInventory;
