import { AppDataSource } from "../config/configDb.js";
import Venta from "../entity/ventas.entity.js";
import VentaInventario from "../entity/ventas_inventario.entity.js";
import Inventario from "../entity/inventario.entity.js";
import User from "../entity/user.entity.js";
import Invoice from "../entity/factura.entity.js";
import Order from "../entity/orden.entity.js";

// Ajustar inventario para los ítems de venta
async function ajustarInventario(itemId, cambioCantidad) {
  const inventoryRepository = AppDataSource.getRepository(Inventario);
  const item = await inventoryRepository.findOne({ where: { id_item: itemId } });

  if (!item) return { success: false, message: "Artículo no encontrado" };
  if (item.stock + cambioCantidad < 0) return { success: false, message: "Inventario insuficiente" };

  item.stock += cambioCantidad;
  await inventoryRepository.save(item);
  return { success: true, item };
}

export async function createSaleService(data) {
  try {
    console.log("Iniciando creación de venta con datos:", data);

    const userRepository = AppDataSource.getRepository(User);
    const trabajador = await userRepository.findOne({ where: { rut: data.rut_trabajador } });
    if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);

    let total = 0;

    // Calcular total para los items
    if (data.items && Array.isArray(data.items)) {
      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);
        total += item.precio * itemData.cantidad;
      }
    }

    console.log("Total calculado para la venta:", total);

    // Crear la venta con el total calculado
    const saleRepository = AppDataSource.getRepository(Venta);
    const sale = saleRepository.create({
      rut_trabajador: data.rut_trabajador,
      rut_cliente: data.rut_cliente,
      fecha_venta: data.fecha_venta,
      total: total,
    });

    await saleRepository.save(sale);
    console.log("Venta creada con éxito:", sale);

    // Crear la factura
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
    console.log("Factura creada con éxito:", invoice);

    // Crear la orden después de crear la factura y teniendo `id_factura`
    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create({
      id_venta: sale.id_venta,
      rut_cliente: data.rut_cliente,
      rut_trabajador: data.rut_trabajador,
      fecha_orden: new Date(),
      tipo_orden: "venta",
      total: total,
      estado_orden: "pendiente",
      hora_inicio: data.hora_inicio ? new Date(data.hora_inicio) : null,
      hora_fin: data.hora_fin ? new Date(data.hora_fin) : null,
      id_factura: invoice.id_factura,
    });

    await orderRepository.save(order);
    console.log("Orden creada con éxito:", order);

    return [sale, null];
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return [null, error.message || "Error al crear la venta"];
  }
}


// Obtener todas las ventas
export async function getAllSalesService() {
  try {
    const saleRepository = AppDataSource.getRepository(Venta);
    const sales = await saleRepository.find({ relations: ["items"] });
    return [sales, null];
  } catch (error) {
    console.error("Error al obtener todas las ventas:", error);
    return [null, "Error al obtener las ventas"];
  }
}

// Obtener una venta por ID
export async function getSaleByIdService(id) {
  try {
    const saleRepository = AppDataSource.getRepository(Venta);
    const sale = await saleRepository.findOne({ where: { id_venta: id }, relations: ["items"] });
    if (!sale) {
      return [null, "Venta no encontrada"];
    }
    return [sale, null];
  } catch (error) {
    console.error("Error al obtener la venta por ID:", error);
    return [null, "Error al obtener la venta"];
  }
}

// Actualizar una venta
export async function updateSaleService(id, data) {
  try {
    // Validar si el trabajador existe
    if (data.rut_trabajador) {
      const trabajador = await AppDataSource.getRepository(User).findOne({ where: { rut: data.rut_trabajador } });
      if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);
    }

    const saleRepository = AppDataSource.getRepository(Venta);
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
      const saleInventoryRepository = AppDataSource.getRepository(VentaInventario);
      
      const itemsActuales = sale.items.map(item => item.id_item);
      const nuevosItems = data.items.map(item => item.id_item);
      const itemsAEliminar = itemsActuales.filter(item => !nuevosItems.includes(item));

      for (const itemId of itemsAEliminar) {
        await saleInventoryRepository.delete({ id_venta: id, id_item: itemId });
      }

      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        let saleInventoryItem = sale.items.find(inv => inv.id_item === itemData.id_item);

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

// Eliminar una venta
export async function deleteSaleService(id) {
  try {
    const saleRepository = AppDataSource.getRepository(Venta);
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

    const saleInventoryRepository = AppDataSource.getRepository(VentaInventario);
    await saleInventoryRepository.delete({ id_venta: sale.id_venta });

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_venta: sale.id_venta } });
    if (order) {
      await orderRepository.delete({ id_orden: order.id_orden });
    }

    await saleRepository.delete({ id_venta: sale.id_venta });

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return { success: false, message: error.message };
  }
}