import { format as formatTempo } from "@formkit/tempo";

// Formatea los datos de un mantenimiento recibido para mostrarlo
export function formatMaintenanceDataGet(maintenance) {
    const items = Array.isArray(maintenance.items)
        ? maintenance.items.map(item => `ID: ${item.id_item}, Cantidad: ${item.cantidad}`).join(', ')
        : "N/A";

    return {
        id_mantenimiento: maintenance.id_mantenimiento,
        descripcion: maintenance.descripcion || 'Descripción no disponible',
        rut_trabajador: maintenance.rut_trabajador,
        rut_cliente: maintenance.rut_cliente,
        fecha_mantenimiento: formatTempo(maintenance.fecha_mantenimiento, "DD-MM-YYYY"),
        items,
        createdAt: formatTempo(maintenance.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(maintenance.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}

// Formatea los datos de un mantenimiento para enviarlos en una petición de creación o edición
export function formatMaintenancesDataEdit(maintenance) {
    return {
        id_mantenimiento: maintenance.id_mantenimiento,
        descripcion: maintenance.descripcion,
        rut_trabajador: maintenance.rut_trabajador,
        rut_cliente: maintenance.rut_cliente,
        fecha_mantenimiento: formatTempo(maintenance.fecha_mantenimiento),
        items: maintenance.items.map(item => ({
            id_item: item.id_item,
            cantidad: item.cantidad
        })),
        createdAt: maintenance.createdAt,
        updatedAt: maintenance.updatedAt,
    };
}
