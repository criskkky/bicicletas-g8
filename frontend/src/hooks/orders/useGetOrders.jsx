import { useState, useEffect } from 'react';
import { getOrders } from '@services/order.service.js'; 
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();

            
            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de órdenes.");
            }

            
            const formattedData = response.map(order => {
                let orderDetails;
                if (order.jobType && order.workerRUT) {
                    
                    orderDetails = `Tipo de trabajo: ${order.jobType} (RUT: ${order.workerRUT})`;
                } else {
                    orderDetails = 'N/A';  
                }

                return {
                    id: order.id,
                    jobType: order.jobType,
                    workerRUT: order.workerRUT,
                    hoursWorked: order.hoursWorked,
                    note: order.note || 'Sin notas',  
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    orderDetails,  
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
