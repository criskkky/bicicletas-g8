import { format as formatTempo } from "@formkit/tempo";

export function formatDataOrder(order) {
  return {
    ...order,
    id_orden: order.id_orden,
    rut_trabajador: order.rut_trabajador,
    tipo_orden: order.tipo_orden,
    id_factura: order.id_factura,
    id_mantenimiento: order.id_mantenimiento || null,
    id_venta: order.id_venta || null,
    fecha_orden: order.fecha_orden,
    hora_inicio: formatTempo(order.hora_inicio, "DD-MM-YYYY HH:mm:ss") || "No especificada",
    hora_fin: formatTempo(order.hora_fin, "DD-MM-YYYY HH:mm:ss") || "No especificada",
    estado_orden: order.estado_orden,
    total: order.total,
    createdAt: formatTempo(order.createdAt, "DD-MM-YYYY HH:mm:ss"),
    updatedAt: formatTempo(order.updatedAt, "DD-MM-YYYY HH:mm:ss"),
  };
}

export function formatOrderPostUpdate(order) {
  return {
    id_orden: order.id_orden,
    rut_trabajador: order.rut_trabajador,
    tipo_orden: order.tipo_orden,
    id_factura: order.id_factura,
    id_mantenimiento: order.id_mantenimiento || null,
    id_venta: order.id_venta || null,
    fecha_orden: order.fecha_orden,
    hora_inicio: order.hora_inicio,
    hora_fin: order.hora_fin,
    estado_orden: order.estado_orden,
    total: order.total,
    createdAt: formatTempo(order.createdAt, "DD-MM-YYYY"),
    updatedAt: formatTempo(order.updatedAt, "DD-MM-YYYY"),
  };
}
