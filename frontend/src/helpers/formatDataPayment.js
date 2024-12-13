import { format as formatTempo } from "@formkit/tempo";

export function formatDataPayment(payment) {
    return {
        ...payment,
        id_pago: payment.id_pago,
        rut_trabajador: payment.rut_trabajador,
        cantidad_ordenes_realizadas: payment.cantidad_ordenes_realizadas,
        horas_trabajadas: payment.horas_trabajadas,
        fecha_pago: formatTempo(payment.fecha_pago, "DD-MM-YYYY"),
        monto: payment.monto,
        estado: payment.estado,
        metodo_pago: payment.metodo_pago,
        createdAt: formatTempo(payment.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(payment.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}

export function formatPaymentPostUpdate(payment) {
    return {
        id_pago: payment.id_pago,
        rut_trabajador: payment.rut_trabajador,
        cantidad_ordenes_realizadas: payment.cantidad_ordenes_realizadas,
        horas_trabajadas: payment.horas_trabajadas,
        fecha_pago: formatTempo(payment.fecha_pago, "DD-MM-YYYY"),
        monto: payment.monto,
        estado: payment.estado,
        metodo_pago: payment.metodo_pago,
        createdAt: formatTempo(payment.createdAt, "DD-MM-YYYY HH:mm:ss"),
        updatedAt: formatTempo(payment.updatedAt, "DD-MM-YYYY HH:mm:ss"),
    };
}
