import { AppDataSource } from "../config/configDb.js";
import Maintenance from "../entity/mantenimiento.entity.js";
import MaintenanceInventory from "../entity/mantenimiento_inventario.entity.js";
import InventoryItem from "../entity/inventario.entity.js";
import User from "../entity/user.entity.js";
import Invoice from "../entity/factura.entity.js";

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

// Función para revertir inventario en caso de error o eliminación
async function revertirInventario(maintenance) {
  const inventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
  const inventoryItems = await inventoryRepository.find({
    where: { id_mantenimiento: maintenance.id_mantenimiento },
    relations: ["inventoryItem"],
  });

  for (const item of inventoryItems) {
    const inventoryAdjustment = await ajustarInventario(item.inventoryItem.id_item, item.cantidad);
    if (!inventoryAdjustment.success) {
      return { success: false, message: inventoryAdjustment.message };
    }
  }

  return { success: true };
}

export async function createMaintenanceService(data) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepository = queryRunner.manager.getRepository(User);
    const user = await userRepository.findOne({ where: { rut: data.rut } });
    if (!user) throw new Error("Usuario no encontrado");

    const maintenanceRepository = queryRunner.manager.getRepository(Maintenance);
    const maintenance = maintenanceRepository.create({
      rut: user.rut, // Asignar el rut del usuario
      rut_cliente: data.rut_cliente,
      fecha_mantenimiento: data.fecha_mantenimiento,
      descripcion: data.descripcion,
    });

    for (const itemData of data.inventoryItems) {
      const item = await queryRunner.manager.findOne(InventoryItem, { where: { id_item: itemData.id_item } });
      if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

      const maintenanceInventoryItem = queryRunner.manager.getRepository(MaintenanceInventory).create({
        maintenance: maintenance,
        item: item,
        cantidad: itemData.cantidad,
        precio_costo: item.precio * itemData.cantidad
      });

      if (!maintenance.inventoryItems) {
        maintenance.inventoryItems = [];
      }
      maintenance.inventoryItems.push(maintenanceInventoryItem);
      await queryRunner.manager.save(maintenanceInventoryItem);
    }

    const invoiceRepository = queryRunner.manager.getRepository(Invoice);
    const invoice = invoiceRepository.create({
      rut_cliente: data.rut_cliente,
      total: calculateTotal(maintenance.inventoryItems),
      fecha_factura: new Date(),
      metodo_pago: "pendiente",
      tipo_factura: "mantenimiento"
    });

    maintenance.invoice = invoice;

    await queryRunner.manager.save(maintenance);
    await queryRunner.manager.save(invoice);

    // Crear la orden correspondiente
    const orderRepository = queryRunner.manager.getRepository(Order);  // Asegúrate de tener esta entidad definida
    const order = orderRepository.create({
      maintenance: maintenance,
      invoice: invoice,
      fecha_orden: new Date(),
      estado_orden: "pendiente",
      total: invoice.total
    });

    await queryRunner.manager.save(order);

    await queryRunner.commitTransaction();
    return [maintenance, invoice, order, null];
  } catch (error) {
    console.error("Error en la transacción:", error);
    await queryRunner.rollbackTransaction();
    return [null, null, null, error];
  } finally {
    await queryRunner.release();
  }
}

function calculateTotal(items) {
  return items.reduce((acc, item) => acc + item.precio_costo * item.cantidad, 0);

}

export async function getAllMaintenanceService() {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  return await maintenanceRepository.find({ relations: ["inventoryItems"] });
}

export async function getMaintenanceService(id) {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  return await maintenanceRepository.findOne(id, { relations: ["inventoryItems"] });
}

export async function updateMaintenanceService(id, data) {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  const maintenance = await maintenanceRepository.findOne(id, { relations: ["inventoryItems"] });

  if (!maintenance) return { success: false, message: "Mantenimiento no encontrado" };

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    maintenance.fecha_mantenimiento = data.fecha_mantenimiento;
    maintenance.descripcion = data.descripcion;

    for (const itemData of data.inventoryItems) {
      const item = await queryRunner.manager.findOne(InventoryItem, { where: { id_item: itemData.id_item } });
      if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

      const maintenanceInventoryItem = maintenance.inventoryItems.find((item) => item.id_item === itemData.id_item);

      if (maintenanceInventoryItem) {
        maintenanceInventoryItem.cantidad = itemData.cantidad;
        maintenanceInventoryItem.precio_costo = item.precio * itemData.cantidad;
        await queryRunner.manager.save(maintenanceInventoryItem);
      } else {
        const newMaintenanceInventoryItem = queryRunner.manager.getRepository(MaintenanceInventory).create({
          maintenance: maintenance,
          item: item,
          cantidad: itemData.cantidad,
          precio_costo: item.precio * itemData.cantidad
        });

        maintenance.inventoryItems.push(newMaintenanceInventoryItem);
        await queryRunner.manager.save(newMaintenanceInventoryItem);
      }
    }

    const invoiceRepository = queryRunner.manager.getRepository(Invoice);
    const invoice = await invoiceRepository.findOne(maintenance.invoice.id_factura);
    invoice.total = calculateTotal(maintenance.inventoryItems);
    await queryRunner.manager.save(invoice);

    await queryRunner.manager.save(maintenance);
    await queryRunner.commitTransaction();
    return { success: true, maintenance };
  } catch (error) {
    console.error("Error en la transacción:", error);
    await queryRunner.rollbackTransaction();
    return { success: false, message: error.message };
  } finally {
    await queryRunner.release();
  }
}

export async function deleteMaintenanceService(id) {
  const maintenanceRepository = AppDataSource.getRepository(Maintenance);
  const maintenance = await maintenanceRepository.findOne(id, { relations: ["inventoryItems"] });

  if (!maintenance) return { success: false, message: "Mantenimiento no encontrado" };

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const inventoryAdjustment = await revertirInventario(maintenance);
    if (!inventoryAdjustment.success) {
      throw new Error(inventoryAdjustment.message);
    }

    await queryRunner.manager.delete(MaintenanceInventory, { id_mantenimiento: maintenance.id_mantenimiento });
    await queryRunner.manager.delete(Maintenance, id);

    await queryRunner.commitTransaction();
    return { success: true };
  } catch (error) {
    console.error("Error en la transacción:", error);
    await queryRunner.rollbackTransaction();
    return { success: false, message: error.message };
  }
}
