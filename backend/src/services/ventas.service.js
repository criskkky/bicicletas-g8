"use strict";

import { AppDataSource } from "../config/configDb.js";
import SaleEntity from "../entity/ventas.entity.js";
import InvoiceEntity from "../entity/factura.entity.js";
import InventoryItem from "../entity/inventario.entity.js";
import Order from "../entity/orden.entity.js";

// Crear una venta con precauciones adicionales
export async function createSaleService(saleData) {
  try {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    const inventoryRepository = AppDataSource.getRepository(InventoryItem);
    let total = 0;

    // Verificar inventario y calcular el total
    for (const item of saleData.items) {
      const inventoryItem = await inventoryRepository.findOne({ where: { id_item: item.id_item } });
      if (!inventoryItem) {
        return [null, `Artículo con ID ${item.id_item} no encontrado`];
      }
      if (inventoryItem.stock < item.cantidad) {
        return [null, `Inventario insuficiente para el artículo con ID ${item.id_item}`];
      }
      // Restar del inventario y sumar al total
      inventoryItem.stock -= item.cantidad;
      await inventoryRepository.save(inventoryItem);
      total += inventoryItem.precio * item.cantidad;
    }

    // Crear la venta
    const sale = saleRepository.create({
      rut_cliente: saleData.rut_cliente,
      fecha_venta: saleData.fecha_venta,
      total: total,
    });

    await saleRepository.save(sale);

    // Crear una factura asociada
    const invoiceRepository = AppDataSource.getRepository(InvoiceEntity);
    const invoice = invoiceRepository.create({
      rut_cliente: saleData.rut_cliente,
      total: total,
      fecha_factura: new Date(),
      metodo_pago: "efectivo", // Valor por defecto
      tipo_factura: "venta",
    });

    await invoiceRepository.save(invoice);

    // Crear la orden correspondiente
    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create({
      id_venta: sale.id_venta,
      id_factura: invoice.id_factura,
      rut: saleData.rut,
      fecha_orden: new Date(),
      tipo_orden: "venta",
      total: total,
      estado_orden: "pendiente",
    });

    await orderRepository.save(order);

    return [sale, null];
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return [null, "Error al crear la venta"];
  }
}

// Servicio para eliminar una venta junto con la orden asociada y ajustar el inventario
export async function deleteSaleService(id_venta) {
  try {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    const orderRepository = AppDataSource.getRepository(Order);

    const sale = await saleRepository.findOne({ where: { id_venta }, relations: ["items"] });
    if (!sale) {
      return [null, "Venta no encontrada"];
    }

    // Ajustar el inventario para los ítems de la venta antes de eliminar la venta
    const inventoryRepository = AppDataSource.getRepository(InventoryItem);
    for (const item of sale.items) {
      const inventoryItem = await inventoryRepository.findOne({ where: { id_item: item.id_item } });
      if (inventoryItem) {
        inventoryItem.stock += item.cantidad;
        await inventoryRepository.save(inventoryItem);
      }
    }

    // Eliminar la orden asociada
    const order = await orderRepository.findOne({ where: { id_venta: sale.id_venta } });
    if (order) {
      await orderRepository.delete(order.id_orden);
    }

    // Eliminar la venta
    await saleRepository.delete(id_venta);

    return [sale, null];
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return [null, "Error al eliminar la venta"];
  }
}

// Servicio para actualizar una venta y ajustar el inventario si es necesario
export async function updateSaleService(id_venta, saleData) {
  try {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    const sale = await saleRepository.findOne({ where: { id_venta }, relations: ["items"] });

    if (!sale) {
      return [null, "Venta no encontrada"];
    }

    // Ajustar el inventario si los ítems cambian
    if (saleData.items) {
      const inventoryRepository = AppDataSource.getRepository(InventoryItem);

      // Primero, devolver el stock de los ítems actuales
      for (const item of sale.items) {
        const inventoryItem = await inventoryRepository.findOne({ where: { id_item: item.id_item } });
        if (inventoryItem) {
          inventoryItem.stock += item.cantidad;
          await inventoryRepository.save(inventoryItem);
        }
      }

      // Luego, verificar y restar el stock de los nuevos ítems
      let total = 0;
      for (const item of saleData.items) {
        const inventoryItem = await inventoryRepository.findOne({ where: { id_item: item.id_item } });
        if (!inventoryItem) {
          return [null, `Artículo con ID ${item.id_item} no encontrado`];
        }
        if (inventoryItem.stock < item.cantidad) {
          return [null, `Inventario insuficiente para el artículo con ID ${item.id_item}`];
        }
        inventoryItem.stock -= item.cantidad;
        await inventoryRepository.save(inventoryItem);
        total += inventoryItem.precio * item.cantidad;
      }

      // Actualizar el total de la venta
      sale.total = total;
    }

    // Actualizar otros campos de la venta
    sale.rut_cliente = saleData.rut_cliente ?? sale.rut_cliente;
    sale.fecha_venta = saleData.fecha_venta ?? sale.fecha_venta;

    await saleRepository.save(sale);

    return [sale, null];
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return [null, "Error al actualizar la venta"];
  }
}

export async function getAllSalesService() {
  try {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    const sales = await saleRepository.find({ relations: ["items"] });
    return [sales, null];
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return [null, "Error al obtener las ventas"];
  }
}

export async function getSaleByIdService(id_venta) {
  try {
    const saleRepository = AppDataSource.getRepository(SaleEntity);
    const sale = await saleRepository.findOne({ where: { id_venta }, relations: ["items"] });

    if (!sale) {
      return [null, "Venta no encontrada"];
    }

    return [sale, null];
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return [null, "Error al obtener la venta"];
  }
}