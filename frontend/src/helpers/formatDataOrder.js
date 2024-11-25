// /src/helpers/formatDataOrder.js

export function formatDataOrder(order) {
  return {
      id: order.id,
      description: order.description,
      customer: order.customer,
      technician: order.technician,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Otros campos según tu estructura de datos
  };
}
