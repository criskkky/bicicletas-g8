import { useState, useEffect } from 'react';
import { getOrders } from '@services/orden.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';
import { format as formatTempo } from "@formkit/tempo";

const useGetOrders = () => {
    const [orders, setOrders] = useState([]);

    const formatOrderData = (order) => {
        return {
            id_orden: order.id_orden,
            rut_trabajador: order.rut_trabajador,
            tipo_orden: order.tipo_orden,
            estado_orden: order.estado_orden,
            fecha_orden: formatTempo(order.fecha_orden, "DD-MM-YYYY"),
            total: order.total,
            hora_inicio: order.hora_inicio ? formatTempo(order.hora_inicio, "DD-MM-YYYY HH:mm") : "No especificada",
            hora_fin: order.hora_fin ? formatTempo(order.hora_fin, "DD-MM-YYYY HH:mm") : "No especificada",
            createdAt: formatTempo(order.createdAt, "DD-MM-YYYY HH:mm"),
            updatedAt: formatTempo(order.updatedAt, "DD-MM-YYYY HH:mm"),
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
