import { format as formatTempo } from "@formkit/tempo";

export function formatDataInvoice(invoice) {
    return {
        ...invoice,
        id_factura: invoice.id_factura,
        rut_trabajador: invoice.rut_trabajador,
        rut_cliente: invoice.rut_cliente,
        fecha_factura: formatTempo(invoice.fecha_factura, "DD-MM-YYYY"),
        metodo_pago: invoice.metodo_pago,
        tipo_factura: invoice.tipo_factura,
        total: invoice.total,
        createdAt: formatTempo(invoice.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(invoice.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}

export function formatInvoicePostUpdate(invoice) {
    return {
        id_factura: invoice.id_factura,
        rut_trabajador: invoice.rut_trabajador,
        rut_cliente: invoice.rut_cliente,
        fecha_factura: formatTempo(invoice.fecha_factura, "DD-MM-YYYY"),
        metodo_pago: invoice.metodo_pago,
        tipo_factura: invoice.tipo_factura,
        total: invoice.total,
        createdAt: formatTempo(invoice.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(invoice.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}
