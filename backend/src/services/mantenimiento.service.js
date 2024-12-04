import { AppDataSource } from "../config/configDb.js";
import Maintenance from "../entity/mantenimiento.entity.js";
import MaintenanceInventory from "../entity/mantenimiento_inventario.entity.js";
import Inventario from "../entity/inventario.entity.js";
import User from "../entity/user.entity.js";
import Invoice from "../entity/factura.entity.js";
import Order from "../entity/orden.entity.js";

// Ajustar inventario para los ítems de mantenimiento
async function ajustarInventario(itemId, cambioCantidad) {
  const inventoryRepository = AppDataSource.getRepository(Inventario);
  const item = await inventoryRepository.findOne({ where: { id_item: itemId } });

  if (!item) return { success: false, message: "Artículo no encontrado" };
  if (item.stock + cambioCantidad < 0) return { success: false, message: "Inventario insuficiente" };

  item.stock += cambioCantidad;
  await inventoryRepository.save(item);
  return { success: true, item };
}

// Crear mantenimiento
export async function createMaintenanceService(data) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Validar si el trabajador existe
    const trabajador = await userRepository.findOne({ where: { rut: data.rut_trabajador } });
    if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);

    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = maintenanceRepository.create({
      rut_trabajador: data.rut_trabajador,
      rut_cliente: data.rut_cliente,
      fecha_mantenimiento: data.fecha_mantenimiento,
      descripcion: data.descripcion,
    });

    await maintenanceRepository.save(maintenance);

    let total = 0;

    if (data.items && Array.isArray(data.items)) {
      const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        const maintenanceInventoryItem = maintenanceInventoryRepository.create({
          id_mantenimiento: maintenance.id_mantenimiento,
          id_item: item.id_item,
          cantidad: itemData.cantidad,
          precio_costo: item.precio * itemData.cantidad,
        });

        await maintenanceInventoryRepository.save(maintenanceInventoryItem);

        total += item.precio * itemData.cantidad;
      }
    }

    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = invoiceRepository.create({
      id_mantenimiento: maintenance.id_mantenimiento,
      rut_cliente: data.rut_cliente,
      rut_trabajador: data.rut_trabajador,
      total: total,
      fecha_factura: new Date(),
      metodo_pago: data.metodo_pago || "efectivo",
      tipo_factura: "mantenimiento",
    });

    await invoiceRepository.save(invoice);

    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create({
      id_mantenimiento: maintenance.id_mantenimiento,
      id_factura: invoice.id_factura,
      rut_trabajador: data.rut_trabajador,
      fecha_orden: new Date(),
      estado_orden: "pendiente",
      total: invoice.total,
      tipo_orden: "mantenimiento",
      hora_inicio: data.hora_inicio ? new Date(data.hora_inicio) : null,
      hora_fin: data.hora_fin ? new Date(data.hora_fin) : null,
    });

    await orderRepository.save(order);

    return [maintenance, invoice, order, null];
  } catch (error) {
    console.error("Error en la creación del mantenimiento:", error);
    return [null, null, null, error];
  }
}

// Obtener todos los mantenimientos
export async function getAllMaintenanceService() {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  return await maintenanceRepository.find({ relations: ["items"] });
}

// Obtener un mantenimiento específico
export async function getMaintenanceService(id) {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  return await maintenanceRepository.findOne({ where: { id_mantenimiento: id }, relations: ["items"] });
}

// Actualizar mantenimiento
export async function updateMaintenanceService(id, data) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Validar si el trabajador existe
    if (data.rut_trabajador) {
      const trabajador = await userRepository.findOne({ where: { rut: data.rut_trabajador } });
      if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);
    }

    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({
      where: { id_mantenimiento: id },
      relations: ["items", "invoice"],
    });

    if (!maintenance) {
      return { success: false, message: "Mantenimiento no encontrado" };
    }

    maintenance.rut_cliente = data.rut_cliente ?? maintenance.rut_cliente;
    maintenance.rut_trabajador = data.rut_trabajador ?? maintenance.rut_trabajador;
    maintenance.fecha_mantenimiento = data.fecha_mantenimiento ?? maintenance.fecha_mantenimiento;
    maintenance.descripcion = data.descripcion ?? maintenance.descripcion;

    let total = 0;

    if (data.items && Array.isArray(data.items)) {
      const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);

      const itemsActuales = maintenance.items.map((item) => item.id_item);
      const nuevosItems = data.items.map((item) => item.id_item);
      const itemsAEliminar = itemsActuales.filter((itemId) => !nuevosItems.includes(itemId));

      for (const itemId of itemsAEliminar) {
        await maintenanceInventoryRepository.delete({ id_mantenimiento: maintenance.id_mantenimiento, id_item: itemId });
      }

      for (const itemData of data.items) {
        const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        let maintenanceInventoryItem = maintenance.items.find((inv) => inv.id_item === itemData.id_item);

        if (maintenanceInventoryItem) {
          maintenanceInventoryItem.cantidad = itemData.cantidad;
          maintenanceInventoryItem.precio_costo = item.precio * itemData.cantidad;
          await maintenanceInventoryRepository.save(maintenanceInventoryItem);
        } else {
          maintenanceInventoryItem = maintenanceInventoryRepository.create({
            id_mantenimiento: maintenance.id_mantenimiento,
            id_item: item.id_item,
            cantidad: itemData.cantidad,
            precio_costo: item.precio * itemData.cantidad,
          });
          await maintenanceInventoryRepository.save(maintenanceInventoryItem);
        }

        total += item.precio * itemData.cantidad;
      }
    } else {
      total = maintenance.invoice.total;
    }

    await maintenanceRepository.save(maintenance);

    if (maintenance.invoice) {
      maintenance.invoice.total = total;
      const invoiceRepository = AppDataSource.getRepository(Invoice);
      await invoiceRepository.save(maintenance.invoice);
    }

    return { success: true, maintenance };
  } catch (error) {
    console.error("Error en la actualización del mantenimiento:", error);
    return { success: false, message: error.message };
  }
}

// Eliminar mantenimiento
export async function deleteMaintenanceService(id) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id_mantenimiento: id }, relations: ["items"] });

    if (!maintenance) {
      return { success: false, message: "Mantenimiento no encontrado" };
    }

    if (maintenance.items) {
      for (const item of maintenance.items) {
        const inventoryAdjustment = await ajustarInventario(item.id_item, item.cantidad);
        if (!inventoryAdjustment.success) {
          throw new Error(inventoryAdjustment.message);
        }
      }
    }

    const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
    await maintenanceInventoryRepository.delete({ id_mantenimiento: maintenance.id_mantenimiento });

    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_mantenimiento: maintenance.id_mantenimiento } });
    if (order) {
      await orderRepository.delete(order.id_orden);
    }

    await maintenanceRepository.delete(id);

    return { success: true };
  } catch (error) {
    console.error("Error en la eliminación del mantenimiento:", error);
    return { success: false, message: error.message };
  }
}
