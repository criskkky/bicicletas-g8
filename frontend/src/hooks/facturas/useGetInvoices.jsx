import { useState, useEffect } from 'react';
import { getInvoices } from '@services/facturas.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetInvoices = () => {
    const [invoices, setInvoices] = useState([]);

    const formatInvoiceData = (invoice) => {
        return {
            id_factura: invoice.id_factura,
            rut_trabajador: invoice.rut_trabajador,
            rut_cliente: invoice.rut_cliente,
            fecha_factura: invoice.fecha_factura,
            metodo_pago: invoice.metodo_pago,
            tipo_factura: invoice.tipo_factura,
            total: invoice.total,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        };
    };
    
    const fetchInvoices = async () => {
        try {
            const response = await getInvoices();
            console.log(response);  // Para verificar la estructura de la respuesta

            if (!Array.isArray(response)) {
                return showWarningAlert("¡Advertencia!", "No existen registros de facturas.");
            }

            const formattedData = response.map(formatInvoiceData);
            setInvoices(formattedData);
        } catch (error) {
            console.error("Error al obtener las facturas: ", error.message);
            showWarningAlert("Error", "No se pudo obtener los datos de las facturas.");
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return { invoices, fetchInvoices, setInvoices };
};

export default useGetInvoices;
