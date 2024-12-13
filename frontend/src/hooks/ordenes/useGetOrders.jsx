import { useState, useEffect } from 'react';
import { getOrders } from '@services/orden.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetOrders = () => {
    const [orders, setOrders] = useState([]);

    const formatOrderData = (order) => {
        return {
            id_orden: order.id_orden,
            rut_trabajador: order.rut_trabajador,
            tipo_orden: order.tipo_orden,
            estado_orden: order.estado_orden,
            fecha_orden: order.fecha_orden,
            total: order.total,
            hora_inicio: order.hora_inicio || "No especificada",
            hora_fin: order.hora_fin || "No especificada",
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    };

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            console.log(response); // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de órdenes.");
            }

            const formattedData = response.map(formatOrderData);
            setOrders(formattedData);
        } catch (error) {
            console.error("Error al obtener las órdenes: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos de las órdenes.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, fetchOrders, setOrders };
};

export default useGetOrders;
