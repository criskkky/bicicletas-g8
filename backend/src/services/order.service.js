import { AppDataSource } from "../config/configDb.js";
import Order from "../entity/order.entity.js";

export async function getOrderService(id) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id } });
    if (!order) return [null, "Orden no encontrada"];
    return [order, null];
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllOrdersService() {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const orders = await orderRepository.find();
    if (!orders || orders.length === 0) return [null, "No hay órdenes registradas"];
    return [orders, null];
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createOrderService(orderData) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const newOrder = orderRepository.create(orderData);
    await orderRepository.save(newOrder);
    return [newOrder, null];
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateOrderService(id, orderData) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id } });
    if (!order) return [null, "Orden no encontrada"];
    
    await orderRepository.update({ id }, { ...orderData, updatedAt: new Date() });
    const updatedOrder = await orderRepository.findOne({ where: { id } });
    return [updatedOrder, null];
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteOrderService(id) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id } });
    if (!order) return [null, "Orden no encontrada"];
    
    await orderRepository.remove(order);
    return [order, null];
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    return [null, "Error interno del servidor"];
  }
}
