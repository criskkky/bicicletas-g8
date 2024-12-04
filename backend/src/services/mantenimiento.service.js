import { AppDataSource } from "../config/configDb.js";
import Maintenance from "../entity/mantenimiento.entity.js";
import MaintenanceInventory from "../entity/mantenimiento_inventario.entity.js";
import InventoryItem from "../entity/inventario.entity.js";
import User from "../entity/user.entity.js";
import Invoice from "../entity/factura.entity.js";
import Order from "../entity/orden.entity.js";

// Ajustar inventario para los ítems de mantenimiento
async function ajustarInventario(inventoryItemId, quantityChange) {
  const inventoryRepository = AppDataSource.getRepository(InventoryItem);
  const item = await inventoryRepository.findOne({ where: { id_item: inventoryItemId } });

  if (!item) return { success: false, message: "Artículo no encontrado" };
  if (item.stock + quantityChange < 0) return { success: false, message: "Inventario insuficiente" };

  item.stock += quantityChange;
  await inventoryRepository.save(item);
  return { success: true, item };
}

// Crear mantenimiento sin transacciones
export async function createMaintenanceService(data) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { rut: data.rut } });
    if (!user) throw new Error("Usuario no encontrado");

    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = maintenanceRepository.create({
      rut: user.rut,
      rut_cliente: data.rut_cliente,
      fecha_mantenimiento: data.fecha_mantenimiento,
      descripcion: data.descripcion,
    });

    await maintenanceRepository.save(maintenance); // Guardar el mantenimiento antes de asociar otros elementos

    let total = 0;

    if (data.inventoryItems && Array.isArray(data.inventoryItems)) {
      const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
      for (const itemData of data.inventoryItems) {
        const item = await AppDataSource.getRepository(InventoryItem).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        const maintenanceInventoryItem = maintenanceInventoryRepository.create({
          id_mantenimiento: maintenance.id_mantenimiento,
          id_item: item.id_item,
          cantidad: itemData.cantidad,
          precio_costo: item.precio * itemData.cantidad,
        });

        await maintenanceInventoryRepository.save(maintenanceInventoryItem);

        // Sumar el costo de este ítem al total
        total += item.precio * itemData.cantidad;
      }
    }

    // Crear una factura con el total calculado
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const invoice = invoiceRepository.create({
      rut_cliente: data.rut_cliente,
      total: total, // Utiliza el total calculado
      fecha_factura: new Date(),
      metodo_pago: "efectivo",
      tipo_factura: "mantenimiento",
    });

    await invoiceRepository.save(invoice);

    // Crear una orden correspondiente
    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create({
      id_mantenimiento: maintenance.id_mantenimiento,
      id_factura: invoice.id_factura,
      rut: user.rut,
      fecha_orden: new Date(),
      estado_orden: "pendiente",
      total: invoice.total,
      tipo_orden: "mantenimiento",
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
  return await maintenanceRepository.find({ relations: ["inventoryItems"] });
}

// Obtener un mantenimiento específico
export async function getMaintenanceService(id) {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  return await maintenanceRepository.findOne({ where: { id_mantenimiento: id }, relations: ["inventoryItems"] });
}

// Actualizar mantenimiento sin transacciones
export async function updateMaintenanceService(id, data) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ 
      where: { id_mantenimiento: id }, 
      relations: ["inventoryItems", "invoice"] // Asegurarse de cargar también la factura
    });

    if (!maintenance) {
      return { success: false, message: "Mantenimiento no encontrado" };
    }

    // Actualizar solo los campos que hayan sido proporcionados
    maintenance.rut_cliente = data.rut_cliente ?? maintenance.rut_cliente;
    maintenance.rut = data.rut ?? maintenance.rut;
    maintenance.fecha_mantenimiento = data.fecha_mantenimiento ?? maintenance.fecha_mantenimiento;
    maintenance.descripcion = data.descripcion ?? maintenance.descripcion;

    let total = 0;

    if (data.inventoryItems && Array.isArray(data.inventoryItems)) {
      const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);

      // Primero, eliminar los items existentes que no estén en la nueva lista
      const itemsActuales = maintenance.inventoryItems.map((item) => item.id_item);
      const nuevosItems = data.inventoryItems.map((item) => item.id_item);
      const itemsAEliminar = itemsActuales.filter((itemId) => !nuevosItems.includes(itemId));

      for (const itemId of itemsAEliminar) {
        await maintenanceInventoryRepository.delete({ id_mantenimiento: maintenance.id_mantenimiento, id_item: itemId });
      }

      // Luego, actualizar los items existentes o agregar los nuevos
      for (const itemData of data.inventoryItems) {
        const item = await AppDataSource.getRepository(InventoryItem).findOne({ where: { id_item: itemData.id_item } });
        if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

        let maintenanceInventoryItem = maintenance.inventoryItems.find((inv) => inv.id_item === itemData.id_item);

        if (maintenanceInventoryItem) {
          // Actualizar cantidad y costo del ítem existente
          maintenanceInventoryItem.cantidad = itemData.cantidad;
          maintenanceInventoryItem.precio_costo = item.precio * itemData.cantidad;
          await maintenanceInventoryRepository.save(maintenanceInventoryItem);
        } else {
          // Crear un nuevo ítem para el mantenimiento
          maintenanceInventoryItem = maintenanceInventoryRepository.create({
            id_mantenimiento: maintenance.id_mantenimiento,
            id_item: item.id_item,
            cantidad: itemData.cantidad,
            precio_costo: item.precio * itemData.cantidad,
          });
          await maintenanceInventoryRepository.save(maintenanceInventoryItem);
        }

        // Sumar el costo de este ítem al total
        total += item.precio * itemData.cantidad;
      }
    } else {
      // Si no se proporcionan nuevos items, mantener el total actual
      total = maintenance.invoice.total;
    }

    // Guardar los cambios en el mantenimiento
    await maintenanceRepository.save(maintenance);

    // Actualizar la factura relacionada con el nuevo total
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

// Eliminar mantenimiento sin transacciones
export async function deleteMaintenanceService(id) {
  try {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({ where: { id_mantenimiento: id }, relations: ["inventoryItems"] });

    if (!maintenance) {
      return { success: false, message: "Mantenimiento no encontrado" };
    }

    // Ajustar el inventario al eliminar los ítems utilizados
    if (maintenance.inventoryItems) {
      for (const item of maintenance.inventoryItems) {
        const inventoryAdjustment = await ajustarInventario(item.id_item, item.cantidad);
        if (!inventoryAdjustment.success) {
          throw new Error(inventoryAdjustment.message);
        }
      }
    }

    // Eliminar los ítems del inventario relacionados con el mantenimiento
    const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
    await maintenanceInventoryRepository.delete({ id_mantenimiento: maintenance.id_mantenimiento });

    // Eliminar la orden relacionada con el mantenimiento
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id_mantenimiento: maintenance.id_mantenimiento } });
    if (order) {
      await orderRepository.delete(order.id_orden);
    }

    // Eliminar el mantenimiento
    await maintenanceRepository.delete(id);

    return { success: true };
  } catch (error) {
    console.error("Error en la eliminación del mantenimiento:", error);
    return { success: false, message: error.message };
  }
}


function calculateTotal(items) {
  return items.reduce((acc, item) => acc + item.precio_costo * item.cantidad, 0);
}
