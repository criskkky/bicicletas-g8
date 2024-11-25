import { format as formatTempo } from "@formkit/tempo";

export function formatDataPayment(payment) {
  return {
    ...payment,
    id: payment.id,
    workerRUT: payment.workerRUT, // RUT del trabajador
    amount: payment.amount, // Monto del pago
    note: payment.note || "Sin notas", // Nota opcional
    createdAt: formatTempo(payment.createdAt, "DD-MM-YYYY HH:mm:ss"), // Fecha de creación formateada
    updatedAt: formatTempo(payment.updatedAt, "DD-MM-YYYY HH:mm:ss"), // Fecha de actualización formateada
  };
}

export function formatPaymentPostUpdate(payment) {
  return {
    id: payment.id,
    workerRUT: payment.workerRUT,
    amount: payment.amount,
    note: payment.note,
    createdAt: formatTempo(payment.createdAt, "DD-MM-YYYY"),
    updatedAt: formatTempo(payment.updatedAt, "DD-MM-YYYY"),
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(value);
}
