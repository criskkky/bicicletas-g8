import { format as formatTempo } from "@formkit/tempo";

export function formatDataSale(sale) {
    return {
        id_venta: sale.id_venta,
        rut_trabajador: sale.rut_trabajador,
        rut_cliente: sale.rut_cliente,
        fecha_venta: formatTempo(sale.fecha_venta, "DD-MM-YYYY"),
        total: parseFloat(sale.total).toFixed(2),
        createdAt: formatTempo(sale.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(sale.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}

export function formatSalePostUpdate(sale) {
    return {
        id_venta: sale.id_venta,
        rut_trabajador: sale.rut_trabajador,
        rut_cliente: sale.rut_cliente,
        fecha_venta: formatTempo(sale.fecha_venta, "DD-MM-YYYY"),
        total: parseFloat(sale.total).toFixed(2),
        createdAt: formatTempo(sale.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(sale.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}
