"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagosEntity from "../entity/pagos.entity.js";
import Order from "../entity/orden.entity.js";
import { In } from "typeorm";

// Tarifa fija por hora
const TARIFA_POR_HORA = 2500;

// Servicio para crear un nuevo pago
export async function createPagoService(pagoData) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const orderRepository = AppDataSource.getRepository(Order);

    // Obtener las órdenes asociadas
    const orders = await orderRepository.find({
      where: {
        id_orden: In(pagoData.id_ordenes),
      },
    });

    if (orders.length === 0) {
      return [null, "No se encontraron órdenes para los IDs proporcionados"];
    }

    // Calcular horas trabajadas y cantidad de órdenes realizadas
    let totalHorasTrabajadas = 0;
    const cantidadOrdenesRealizadas = orders.length;

    for (const order of orders) {
      if (order.hora_inicio && order.hora_fin) {
        const horasTrabajadas = (new Date(order.hora_fin) - new Date(order.hora_inicio)) / (1000 * 60 * 60);
        totalHorasTrabajadas += horasTrabajadas;
      }
    }

    // Calcular el monto basado en las horas trabajadas
    const monto = totalHorasTrabajadas * TARIFA_POR_HORA;

    // Crear el nuevo pago
    const newPago = pagosRepository.create({
      rut_trabajador: pagoData.rut_trabajador,
      cantidad_ordenes_realizadas: cantidadOrdenesRealizadas,
      horas_trabajadas: totalHorasTrabajadas,
      fecha_pago: pagoData.fecha_pago,
      metodo_pago: pagoData.metodo_pago,
      monto,
      estado: pagoData.estado,
    });

    // Guardar el pago
    await pagosRepository.save(newPago);

    // Asociar el pago con las órdenes
    for (const order of orders) {
      order.pago = newPago;
      await orderRepository.save(order);
    }

    return [newPago, null];
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar un pago existente
export async function updatePagoService(id_pago, pagoData) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const orderRepository = AppDataSource.getRepository(Order);

    const pago = await pagosRepository.findOne({ where: { id_pago }, relations: ["ordenes"] });

    if (!pago) {
      return [null, "Pago no encontrado"];
    }

    // Desasociar las órdenes actuales
    if (pago.ordenes) {
      for (const order of pago.ordenes) {
        order.pago = null;
        await orderRepository.save(order);
      }
    }

    // Asociar nuevas órdenes si se proporcionan
    let totalHorasTrabajadas = 0;
    let cantidadOrdenesRealizadas = 0;

    if (pagoData.id_ordenes) {
      const orders = await orderRepository.find({
        where: {
          id_orden: In(pagoData.id_ordenes),
        },
      });

      if (orders.length === 0) {
        return [null, "No se encontraron órdenes para los IDs proporcionados"];
      }

      cantidadOrdenesRealizadas = orders.length;

      for (const order of orders) {
        if (order.hora_inicio && order.hora_fin) {
          const horasTrabajadas = (new Date(order.hora_fin) - new Date(order.hora_inicio)) / (1000 * 60 * 60);
          totalHorasTrabajadas += horasTrabajadas;
        }

        order.pago = pago;
        await orderRepository.save(order);
      }
    }

    // Calcular el nuevo monto
    const monto = totalHorasTrabajadas * TARIFA_POR_HORA;

    // Actualizar el pago con los nuevos datos
    pagosRepository.merge(pago, {
      ...pagoData,
      cantidad_ordenes_realizadas,
      horas_trabajadas: totalHorasTrabajadas,
      monto,
    });

    await pagosRepository.save(pago);

    return [pago, null];
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener un pago por ID
export async function getPagoService(id_pago) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pago = await pagosRepository.findOne({ where: { id_pago }, relations: ["ordenes"] });

    if (!pago) {
      return [null, "Pago no encontrado"];
    }

    return [pago, null];
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todos los pagos
export async function getAllPagosService() {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const pagos = await pagosRepository.find({ relations: ["ordenes"] });

    return [pagos, null];
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar un pago
export async function deletePagoService(id_pago) {
  try {
    const pagosRepository = AppDataSource.getRepository(PagosEntity);
    const orderRepository = AppDataSource.getRepository(Order);

    const pago = await pagosRepository.findOne({ where: { id_pago }, relations: ["ordenes"] });

    if (!pago) {
      return [null, "Pago no encontrado"];
    }

    // Desasociar las órdenes antes de eliminar el pago
    for (const order of pago.ordenes) {
      order.pago = null;
      await orderRepository.save(order);
    }

    await pagosRepository.remove(pago);

    return [pago, null];
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return [null, "Error interno del servidor"];
  }
}
