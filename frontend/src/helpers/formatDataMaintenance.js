import { format as formatTempo } from "@formkit/tempo";

export function formatDataMaintenance(maintenance) {
    return {
        ...maintenance,
        id_mantenimiento: maintenance.id_mantenimiento,
        descripcion: maintenance.descripcion,
        rut_trabajador: maintenance.rut_trabajador,
        rut_cliente: maintenance.rut_cliente,
        fecha_mantenimiento: formatTempo(maintenance.date, "DD-MM-YYYY"),
        // items: maintenance.items,
        id_item: maintenance.id_item,
        cantidad: maintenance.cantidad,
        createdAt: formatTempo(maintenance.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(maintenance.updatedAt, "DD-MM-YYYY HH:mm:ss")
    };
}

export function formatMaintenancePostUpdate(maintenance) {
    return {
        id_mantenimiento: maintenance.id_mantenimiento,
        descripcion: maintenance.descripcion,
        rut_trabajador: maintenance.rut_trabajador,
        rut_cliente: maintenance.rut_cliente,
        fecha_mantenimiento: formatTempo(maintenance.date, "DD-MM-YYYY"),
        // items: maintenance.items,
        id_item: maintenance.id_item,
        cantidad: maintenance.cantidad,
        createdAt: formatTempo(maintenance.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(maintenance.updatedAt, "DD-MM-YYYY HH:mm:ss")
    };
}