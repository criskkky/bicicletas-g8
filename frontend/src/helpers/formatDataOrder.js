import { format as formatTempo } from "@formkit/tempo";

export function formatDataOrder(order) {
  return {
    ...order,
    id: order.id,
    workerRUT: order.workerRUT, // RUT del trabajador
    jobType: order.jobType, // Tipo de trabajo (MANTENIMIENTO o VENTA)
    jobID: order.jobID, // ID del trabajo realizado
    hoursWorked: order.hoursWorked, // Horas trabajadas
    note: order.note || "Sin notas", // Nota opcional
    createdAt: formatTempo(order.createdAt, "DD-MM-YYYY HH:mm:ss"), // Fecha de creación formateada
    updatedAt: formatTempo(order.updatedAt, "DD-MM-YYYY HH:mm:ss"), // Fecha de actualización formateada
  };
}

export function formatOrderPostUpdate(order) {
  return {
    id: order.id,
    workerRUT: order.workerRUT,
    jobType: order.jobType,
    jobID: order.jobID,
    hoursWorked: order.hoursWorked,
    note: order.note,
    createdAt: formatTempo(order.createdAt, "DD-MM-YYYY"),
    updatedAt: formatTempo(order.updatedAt, "DD-MM-YYYY"),
  };
}
