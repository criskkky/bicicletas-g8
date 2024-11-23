import { format as formatTempo } from "@formkit/tempo";

export function formatDataMaintenance(maintenance) {
    return {
        ...maintenance,
        id: maintenance.id,
        description: maintenance.description,
        technician: maintenance.technician,
        status: maintenance.status,
        date: formatTempo(maintenance.date, "DD-MM-YYYY"),
        idItemUsed: maintenance.idItemUsed,
        quantityUsed: maintenance.quantityUsed,
        createdAt: formatTempo(maintenance.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(maintenance.updatedAt, "DD-MM-YYYY HH:mm:ss")
    };
}

export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}

export function formatMaintenancePostUpdate(maintenance) {
    return {
        id: maintenance.id,
        description: maintenance.description,
        technician: maintenance.technician,
        status: maintenance.status,
        date: formatTempo(maintenance.date, "DD-MM-YYYY"),
        idItemUsed: maintenance.idItemUsed,
        quantityUsed: maintenance.quantityUsed,
        createdAt: formatTempo(maintenance.createdAt, "DD-MM-YYYY"),
        updatedAt: formatTempo(maintenance.updatedAt, "DD-MM-YYYY")
    };
}