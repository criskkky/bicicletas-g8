import { useState, useEffect } from 'react';
import { getOrders } from '@services/order.service.js'; // Suponiendo que existe este servicio
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();

            // Verifica si la respuesta es un array válido
            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de órdenes.");
            }

            // Formatear los datos
            const formattedData = response.map(order => {
                let orderDetails;
                if (order.jobType && order.workerRUT) {
                    // Si jobType y workerRUT existen, los usamos para mostrar detalles clave
                    orderDetails = `Tipo de trabajo: ${order.jobType} (RUT: ${order.workerRUT})`;
                } else {
                    orderDetails = 'N/A';  // Si faltan datos, retorna 'N/A'
                }

                return {
                    id: order.id,
                    jobType: order.jobType,
                    workerRUT: order.workerRUT,
                    hoursWorked: order.hoursWorked,
                    note: order.note || 'Sin notas',  // Mostrar "Sin notas" si no hay
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    orderDetails,  // Detalles del orden formateados
                };
            });

            setOrders(formattedData);
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, fetchOrders, setOrders };
};

export default useGetOrders;
