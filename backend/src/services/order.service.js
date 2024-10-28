import Order from '../entities/Order.js'; // Asegúrate de que la ruta sea correcta

export async function getOrderService(id) {
  try {
    const order = await Order.findById(id);
    if (!order) throw new Error('Orden no encontrada');
    return [order, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getAllOrdersService() {
  try {
    const orders = await Order.find();
    return [orders, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function createOrderService(data) {
  try {
    const order = new Order(data);
    await order.save();
    return [order, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function updateOrderService(id, data) {
  try {
    const order = await Order.findByIdAndUpdate(id, data, { new: true });
    if (!order) throw new Error('Orden no encontrada');
    return [order, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deleteOrderService(id) {
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new Error('Orden no encontrada');
    return [order, null];
  } catch (error) {
    return [null, error.message];
  }
}
