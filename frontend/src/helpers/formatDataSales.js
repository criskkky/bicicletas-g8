import { format as formatTempo } from "@formkit/tempo";

export function formatDataSale(sale) {
    return {
        ...sale,
        id_venta: sale.id_venta,
        rut_trabajador: sale.rut_trabajador,
        rut_cliente: sale.rut_cliente,
        fecha_venta: formatTempo(sale.date, "DD-MM-YYYY"),
        id_item: sale.id_item,
        cantidad: sale.cantidad,
        createdAt: formatTempo(sale.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(sale.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}

export function formatSalePostUpdate(sale) {
    return {
        id_venta: sale.id_venta,
        rut_trabajador: sale.rut_trabajador,
        rut_cliente: sale.rut_cliente,
        fecha_venta: formatTempo(sale.date, "DD-MM-YYYY"),
        id_item: sale.id_item,
        cantidad: sale.cantidad,
        createdAt: formatTempo(sale.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(sale.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}
