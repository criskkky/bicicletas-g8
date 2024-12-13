import { AppDataSource } from "../config/configDb.js";
import Sale from "../entity/ventas.entity.js";
import SaleInventory from "../entity/ventas_inventario.entity.js";
import Inventario from "../entity/inventario.entity.js";
import User from "../entity/user.entity.js";
import Invoice from "../entity/factura.entity.js";
import Order from "../entity/orden.entity.js";

// Ajustar inventario para los ítems de la venta
async function ajustarInventario(itemId, cambioCantidad) {
  const inventoryRepository = AppDataSource.getRepository(Inventario);
  const item = await inventoryRepository.findOne({ where: { id_item: itemId } });

  if (!item) return { success: false, message: "Artículo no encontrado" };
  if (item.stock + cambioCantidad < 0) return { success: false, message: "Inventario insuficiente" };

  item.stock += cambioCantidad;
  await inventoryRepository.save(item);
  return { success: true, item };
}

// Crear venta
export async function createSaleService(data) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Validar si el trabajador existe
    const trabajador = await userRepository.findOne({ where: { rut: data.rut_trabajador } });
    if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);

    const saleRepository = AppDataSource.getRepository(Sale);

    // Inicializa el total con 0 para evitar valores null
    const sale = saleRepository.create({
      rut_trabajador: data.rut_trabajador,
      rut_cliente: data.rut_cliente,
      fecha_venta: data.fecha_venta,
      total: 0, // Valor inicial para evitar problemas
    });

    await saleRepository.save(sale);

    let total = 0;

    if (data.items && Array.isArray(data.items)) {
      const saleInventoryRepository = AppDataSource.getRepository(SaleInventory);
      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        const saleInventoryItem = saleInventoryRepository.create({
          id_venta: sale.id_venta,
          id_item: item.id_item,
          cantidad: itemData.cantidad,
          precio_costo: item.precio * itemData.cantidad,
        });

        await saleInventoryRepository.save(saleInventoryItem);

        total += item.precio * itemData.cantidad;
      }
    }

    // Actualizar el total calculado en la venta
    sale.total = total;
    await saleRepository.save(sale);

    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = invoiceRepository.create({
      id_venta: sale.id_venta,
      rut_cliente: data.rut_cliente,
      rut_trabajador: data.rut_trabajador,
      total: total,
      fecha_factura: new Date(),
      metodo_pago: data.metodo_pago || "efectivo",
      tipo_factura: "venta",
    });

    await invoiceRepository.save(invoice);

    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create({
      id_venta: sale.id_venta,
      id_factura: invoice.id_factura,
      rut_trabajador: data.rut_trabajador,
      fecha_orden: new Date(),
      estado_orden: "pendiente",
      total: invoice.total,
      tipo_orden: "venta",
      hora_inicio: data.hora_inicio ? new Date(data.hora_inicio) : null,
      hora_fin: data.hora_fin ? new Date(data.hora_fin) : null,
    });

    await orderRepository.save(order);

    return [sale, invoice, order, null];
  } catch (error) {
    console.error("Error en la creación de la venta:", error);
    return [null, null, null, error];
  }
}

// Obtener todas las ventas
export async function getAllSalesService() {
  const saleRepository = AppDataSource.getRepository(Sale);
  return await saleRepository.find({ relations: ["items"] });
}

// Obtener una venta específica
export async function getSaleService(id) {
  const saleRepository = AppDataSource.getRepository(Sale);
  return await saleRepository.findOne({ where: { id_venta: id }, relations: ["items"] });
}

// Actualizar venta
export async function updateSaleService(id, data) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Validar si el trabajador existe
    if (data.rut_trabajador) {
      const trabajador = await userRepository.findOne({ where: { rut: data.rut_trabajador } });
      if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);
    }

    const saleRepository = AppDataSource.getRepository(Sale);
    const sale = await saleRepository.findOne({
      where: { id_venta: id },
      relations: ["items", "invoice"],
    });

    if (!sale) {
      return { success: false, message: "Venta no encontrada" };
    }

    sale.rut_cliente = data.rut_cliente ?? sale.rut_cliente;
    sale.rut_trabajador = data.rut_trabajador ?? sale.rut_trabajador;
    sale.fecha_venta = data.fecha_venta ?? sale.fecha_venta;

    let total = 0;

    if (data.items && Array.isArray(data.items)) {
      const saleInventoryRepository = AppDataSource.getRepository(SaleInventory);

      const itemsActuales = sale.items.map((item) => item.id_item);
      const nuevosItems = data.items.map((item) => item.id_item);
      const itemsAEliminar = itemsActuales.filter((itemId) => !nuevosItems.includes(itemId));

      for (const itemId of itemsAEliminar) {
        await saleInventoryRepository.delete({ id_venta: sale.id_venta, id_item: itemId });
      }

      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        let saleInventoryItem = sale.items.find((inv) => inv.id_item === itemData.id_item);

        if (saleInventoryItem) {
          saleInventoryItem.cantidad = itemData.cantidad;
          saleInventoryItem.precio_costo = item.precio * itemData.cantidad;
          await saleInventoryRepository.save(saleInventoryItem);
        } else {
          saleInventoryItem = saleInventoryRepository.create({
            id_venta: sale.id_venta,
            id_item: item.id_item,
            cantidad: itemData.cantidad,
            precio_costo: item.precio * itemData.cantidad,
          });
          await saleInventoryRepository.save(saleInventoryItem);
        }

        total += item.precio * itemData.cantidad;
      }
    } else {
      total = sale.invoice.total;
    }

    await saleRepository.save(sale);

    if (sale.invoice) {
      sale.invoice.total = total;
      const invoiceRepository = AppDataSource.getRepository(Invoice);
      await invoiceRepository.save(sale.invoice);
    }

    return { success: true, sale };
  } catch (error) {
    console.error("Error en la actualización de la venta:", error);
    return { success: false, message: error.message };
  }
}

// Eliminar venta
export async function deleteSaleService(id) {
  try {
    const saleRepository = AppDataSource.getRepository(Sale);
    const sale = await saleRepository.findOne({ where: { id_venta: id }, relations: ["items"] });

    if (!sale) {
      return { success: false, message: "Venta no encontrada" };
    }

    if (sale.items) {
      for (const item of sale.items) {
        const inventoryAdjustment = await ajustarInventario(item.id_item, item.cantidad);
        if (!inventoryAdjustment.success) {
          throw new Error(inventoryAdjustment.message);
        }
      }
    }

    const saleInventoryRepository = AppDataSource.getRepository(SaleInventory);
    await saleInventoryRepository.delete({ id_venta: sale.id_venta });

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_venta: sale.id_venta } });
    if (order) {
      await orderRepository.delete(order.id_orden);
    }

    await saleRepository.delete(id);

    return { success: true };
  } catch (error) {
    console.error("Error en la eliminación de la venta:", error);
    return { success: false, message: error.message };
  }
}
