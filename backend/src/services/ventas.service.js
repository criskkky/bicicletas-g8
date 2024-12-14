import { AppDataSource } from "../config/configDb.js";
import Venta from "../entity/ventas.entity.js";
import VentaInventario from "../entity/ventas_inventario.entity.js";
import Inventario from "../entity/inventario.entity.js";
import Invoice from "../entity/factura.entity.js";
import Order from "../entity/orden.entity.js";
import User from "../entity/user.entity.js";

// Ajustar inventario para las ventas
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

    const ventaRepository = AppDataSource.getRepository(Venta);

    let total = 0;

    if (data.items && Array.isArray(data.items)) {
      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        if (item.cantidad < itemData.cantidad) {
          throw new Error(`Inventario insuficiente para el producto ID ${itemData.id_item}. 
            Disponible: ${item.cantidad}, Solicitado: ${itemData.cantidad}`);
        }

        total += item.precio * itemData.cantidad;
      }
    }

    const venta = ventaRepository.create({
      rut_trabajador: data.rut_trabajador,
      rut_cliente: data.rut_cliente,
      fecha_venta: data.fecha_venta,
      total,
    });

    await ventaRepository.save(venta);

    if (data.items && Array.isArray(data.items)) {
      const ventaInventarioRepository = AppDataSource.getRepository(VentaInventario);

      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        const inventoryAdjustment = await ajustarInventario(itemData.id_item, -itemData.cantidad);

        if (!inventoryAdjustment.success) {
          throw new Error(`Inventario insuficiente para el producto ID ${itemData.id_item}. 
            Disponible: ${inventoryAdjustment.available}, Solicitado: ${itemData.cantidad}`);
        }

        const ventaInventarioItem = ventaInventarioRepository.create({
          id_venta: venta.id_venta,
          id_item: item.id_item,
          cantidad: itemData.cantidad,
          precio_costo: item.precio * itemData.cantidad,
        });

        await ventaInventarioRepository.save(ventaInventarioItem);
      }
    }

    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = invoiceRepository.create({
      id_venta: venta.id_venta,
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
      id_venta: venta.id_venta,
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

    return [venta, invoice, order, null];
  } catch (error) {
    console.error("Error en la creación de la venta:", error);
    return [null, null, null, error];
  }
}


// Obtener todas las ventas
export async function getAllSalesService() {
  const ventaRepository = AppDataSource.getRepository(Venta);
  return await ventaRepository.find({ relations: ["items"] });
}

// Obtener una venta específica
export async function getSaleService(id) {
  const ventaRepository = AppDataSource.getRepository(Venta);
  return await ventaRepository.findOne({ where: { id_venta: id }, relations: ["items"] });
}

// Actualizar una venta
export async function updateSaleService(id, data) {
  try {
    const ventaRepository = AppDataSource.getRepository(Venta);
    const venta = await ventaRepository.findOne({ where: { id_venta: id }, relations: ["items"] });

    if (!venta) {
      return { success: false, message: "Venta no encontrada" };
    }

    // Actualizar datos básicos de la venta
    venta.rut_cliente = data.rut_cliente ?? venta.rut_cliente;
    venta.rut_trabajador = data.rut_trabajador ?? venta.rut_trabajador;
    venta.fecha_venta = data.fecha_venta ? new Date(data.fecha_venta) : venta.fecha_venta;

    // Inicializar total
    let total = 0;

    // Actualización de los items y el inventario
    if (data.items && Array.isArray(data.items)) {
      const ventaInventarioRepository = AppDataSource.getRepository(VentaInventario);

      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        const ventaInventarioItem = await ventaInventarioRepository.findOne({
          where: { id_venta: venta.id_venta, id_item: item.id_item },
        });

        if (ventaInventarioItem) {
          const inventoryAdjustment = await ajustarInventario(
            item.id_item, itemData.cantidad - ventaInventarioItem.cantidad
            );
          if (!inventoryAdjustment.success) {
            throw new Error(inventoryAdjustment.message);
          }

          ventaInventarioItem.cantidad = itemData.cantidad;
          ventaInventarioItem.precio_costo = item.precio * itemData.cantidad;
          await ventaInventarioRepository.save(ventaInventarioItem);
        } else {
          const newItem = ventaInventarioRepository.create({
            id_venta: venta.id_venta,
            id_item: item.id_item,
            cantidad: itemData.cantidad,
            precio_costo: item.precio * itemData.cantidad,
          });
          await ventaInventarioRepository.save(newItem);
        }

        // Sumar al total
        total += item.precio * itemData.cantidad;
      }
    }

    // Asignar el total recalculado a la venta
    venta.total = total;
    await ventaRepository.save(venta);

    // Actualizar factura y orden
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = await invoiceRepository.findOne({ where: { id_venta: id } });
    if (invoice) {
      invoice.total = total;
      await invoiceRepository.save(invoice);
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_venta: id } });
    if (order) {
      order.total = total;
      await orderRepository.save(order);
    }

    return [venta, invoice, order, null];
  } catch (error) {
    console.error("Error en la actualización de la venta:", error);
    return [null, null, null, error];
  }
}


// Eliminar una venta
export async function deleteSaleService(id) {
  try {
    const ventaRepository = AppDataSource.getRepository(Venta);
    const venta = await ventaRepository.findOne({ where: { id_venta: id }, relations: ["items"] });

    if (!venta) {
      return { success: false, message: "Venta no encontrada" };
    }

    if (venta.items) {
      for (const item of venta.items) {
        const inventoryAdjustment = await ajustarInventario(item.id_item, item.cantidad);
        if (!inventoryAdjustment.success) {
          throw new Error(inventoryAdjustment.message);
        }
      }
    }

    const ventaInventarioRepository = AppDataSource.getRepository(VentaInventario);
    await ventaInventarioRepository.delete({ id_venta: venta.id_venta });

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_venta: venta.id_venta } });
    if (order) {
      await orderRepository.delete(order.id_orden);
    }

    await ventaRepository.delete(id);

    return { success: true };
  } catch (error) {
    console.error("Error en la eliminación de la venta:", error);
    return { success: false, message: error.message };
  }
}
