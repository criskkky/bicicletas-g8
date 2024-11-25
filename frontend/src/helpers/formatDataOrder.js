import { format as formatTempo } from "@formkit/tempo";

export function formatDataOrder(order) {
  return {
      id: order.id,
      description: order.description,
      customer: order.customer,
      technician: order.technician,
      status: order.status,
      createdAt: formatTempo(order.createdAt),
      updatedAt: formatTempo(order.updatedAt),
  };
}

export function formatOrderPostUpdate(id){
  return {
    id: order.id,
    description: order.description,
    customer: order.customer,
    technician: order.technician,
    status: order.status,
    createdAt: formatTempo(order.createdAt),
    updatedAt: formatTempo(order.updatedAt),
  }
}