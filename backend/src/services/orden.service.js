import { AppDataSource } from "../config/configDb.js";
import Order from "../entity/orden.entity.js";

// Servicio para obtener una orden por ID
export async function getOrderService(id_orden) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_orden } });
    if (!order) return [null, "Orden no encontrada"];
    return [order, null];
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todas las órdenes
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

// Servicio para crear una nueva orden
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

// Servicio para actualizar una orden
export async function updateOrderService(id_orden, orderData) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_orden } });
    if (!order) {
      return [null, "Orden no encontrada"];
    }

    orderRepository.merge(order, orderData);
    await orderRepository.save(order);

    return [order, null];
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar una orden
export async function deleteOrderService(id_orden) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_orden } });
    if (!order) {
      return [null, "Orden no encontrada"];
    }

    await orderRepository.remove(order);

    return [order, null];
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    return [null, "Error interno del servidor"];
  }
}
