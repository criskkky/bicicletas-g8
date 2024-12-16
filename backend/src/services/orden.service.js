"use strict";

import { AppDataSource } from "../config/configDb.js";
import Order from "../entity/orden.entity.js";
import Maintenance from "../entity/mantenimiento.entity.js";
import Sale from "../entity/ventas.entity.js";
import Pago from "../entity/pagos.entity.js";


async function obtenerRutTrabajador(orderData) {
  let rut_trabajador;

  if (orderData.id_mantenimiento) {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne(
      { where: { id_mantenimiento: orderData.id_mantenimiento } 
    });
    if (!maintenance) throw new Error("Mantenimiento no encontrado");
    rut_trabajador = maintenance.rut_trabajador;
  } else if (orderData.id_venta) {
    const saleRepository = AppDataSource.getRepository(Sale);
    const sale = await saleRepository.findOne({ where: { id_venta: orderData.id_venta } });
    if (!sale) throw new Error("Venta no encontrada");
    rut_trabajador = sale.rut_trabajador;
  } else {
    throw new Error("No se proporcionó una referencia válida para mantenimiento o venta");
  }

  return rut_trabajador;
}

// Servicio para obtener una orden por ID
export async function getOrderService(id_orden) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_orden }, relations: ["mantenimiento", "venta", "pago"] });
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
    const orders = await orderRepository.find({ relations: ["mantenimiento", "venta", "pago"] });
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
    const pagoRepository = AppDataSource.getRepository(Pago);

    
    const rut_trabajador = await obtenerRutTrabajador(orderData);

  
    let pago = null;
    if (orderData.id_pago) {
      pago = await pagoRepository.findOne({ where: { id_pago: orderData.id_pago } });
      if (!pago) throw new Error("Pago no encontrado");
    }

   
    const newOrder = orderRepository.create({
      ...orderData,
      rut_trabajador, 
      hora_inicio: orderData.hora_inicio ? new Date(orderData.hora_inicio) : null,
      hora_fin: orderData.hora_fin ? new Date(orderData.hora_fin) : null,
      pago, 
    });

    await orderRepository.save(newOrder);
    return [newOrder, null];
  } catch (error) {
    console.error("Error al crear la orden:", error.message);
    return [null, error.message];
  }
}

export async function updateOrderService(id_orden, orderData) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const pagoRepository = AppDataSource.getRepository(Pago);
    const order = await orderRepository.findOne({ where: { id_orden }, relations: ["mantenimiento", "venta", "pago"] });
    if (!order) {
      return [null, "Orden no encontrada"];
    }

   
    if (orderData.hora_inicio) {
      order.hora_inicio = new Date(orderData.hora_inicio);
    }
    if (orderData.hora_fin) {
      order.hora_fin = new Date(orderData.hora_fin);
    }

    
    if (orderData.id_mantenimiento || orderData.id_venta) {
      order.rut_trabajador = await obtenerRutTrabajador(orderData);
    }

    
    if (orderData.id_pago) {
      const pago = await pagoRepository.findOne({ where: { id_pago: orderData.id_pago } });
      if (!pago) {
        return [null, "Pago no encontrado"];
      }
      order.pago = pago;
    }

    orderRepository.merge(order, orderData);
    await orderRepository.save(order);

    return [order, null];
  } catch (error) {
    console.error("Error al actualizar la orden:", error.message);
    return [null, error.message];
  }
}

export async function deleteOrderService(id_orden) {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_orden }, relations: ["pago"] });
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
