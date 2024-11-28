import { format as formatTempo } from "@formkit/tempo";

export function formatDataOrder(order) {
  return {
    ...order,
    id: order.id,
    workerRUT: order.workerRUT, 
    jobType: order.jobType, 
    jobID: order.jobID, 
    hoursWorked: order.hoursWorked,
    note: order.note || "Sin notas",
    createdAt: formatTempo(order.createdAt, "DD-MM-YYYY HH:mm:ss"),
    updatedAt: formatTempo(order.updatedAt, "DD-MM-YYYY HH:mm:ss"),
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
