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
// Crear mantenimiento
export async function createMaintenanceService(data) {
  try {
      const userRepository = AppDataSource.getRepository(User);
      const maintenanceRepository = AppDataSource.getRepository(Maintenance);
      const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);

      // Validar si el trabajador existe
      const trabajador = await userRepository.findOne({ where: { rut: data.rut_trabajador } });
      if (!trabajador) throw new Error(`Trabajador con RUT ${data.rut_trabajador} no encontrado`);

      const maintenance = maintenanceRepository.create({
          rut_trabajador: data.rut_trabajador,
          rut_cliente: data.rut_cliente,
          fecha_mantenimiento: data.fecha_mantenimiento,
          descripcion: data.descripcion,
      });

      await maintenanceRepository.save(maintenance);

      let total = 0;

      if (maintenance.items) {
        for (const existingItem of maintenance.items) {
          await ajustarInventario(existingItem.id_item, existingItem.cantidad); // Devolver al inventario
          await maintenanceInventoryRepository.delete({ id_mantenimiento: id, id_item: existingItem.id_item }); // Eliminar vínculo
        }
      }

      if (data.items && Array.isArray(data.items)) {

          for (const itemData of data.items) {
              const item = await AppDataSource.getRepository(Inventario).findOne({ where: { id_item: itemData.id_item } });
              if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

              // Ajustar inventario (disminuir stock)
              const inventoryAdjustment = await ajustarInventario(item.id_item, -itemData.cantidad);
              if (!inventoryAdjustment.success) {
                throw new Error(inventoryAdjustment.message);
              }

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

      return {
          success: true,
          maintenance,
          invoice,
          order,
      };
  } catch (error) {
      console.error("Error en la creación del mantenimiento:", error);
      return {
          success: false,
          message: error.message,
      };
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
      const maintenanceRepository = AppDataSource.getRepository(Maintenance);
      const maintenance = await maintenanceRepository.findOne({
          where: { id_mantenimiento: id },
          relations: ["items"], // Aseguramos que traiga los ítems asociados
      });

      if (!maintenance) {
          return { success: false, message: "Mantenimiento no encontrado" };
      }

      // Actualizar datos básicos
      maintenance.rut_cliente = data.rut_cliente ?? maintenance.rut_cliente;
      maintenance.rut_trabajador = data.rut_trabajador ?? maintenance.rut_trabajador;
      maintenance.descripcion = data.descripcion ?? maintenance.descripcion;

      // Guardar cambios en mantenimiento
      await maintenanceRepository.save(maintenance);

      // Confirmar que `id_mantenimiento` existe
      if (!maintenance.id_mantenimiento) {
          throw new Error("El mantenimiento no tiene un ID válido.");
      }

      // Devolver al inventario las cantidades previas
      const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
      if (maintenance.items) {
          for (const item of maintenance.items) {
              const inventoryAdjustment = await ajustarInventario(item.id_item, item.cantidad);
              if (!inventoryAdjustment.success) {
                  throw new Error(inventoryAdjustment.message);
              }
          }

          // Eliminar relaciones obsoletas
          await maintenanceInventoryRepository.delete({ id_mantenimiento: maintenance.id_mantenimiento });
      }

      // Procesar nuevos ítems y ajustar inventario
      let total = 0;
      if (data.items && Array.isArray(data.items)) {
          const inventoryRepository = AppDataSource.getRepository(Inventario);
          for (const itemData of data.items) {
              const item = await inventoryRepository.findOne({ where: { id_item: itemData.id_item } });
              if (!item) throw new Error(`Ítem de inventario no encontrado: ID ${itemData.id_item}`);

              // Ajustar el inventario con las nuevas cantidades
              const inventoryAdjustment = await ajustarInventario(item.id_item, -itemData.cantidad);
              if (!inventoryAdjustment.success) {
                  throw new Error(inventoryAdjustment.message);
              }

              // Crear una nueva relación en MaintenanceInventory
              const newItem = maintenanceInventoryRepository.create({
                  id_mantenimiento: maintenance.id_mantenimiento, // Aseguramos que este valor exista
                  id_item: item.id_item,
                  cantidad: itemData.cantidad,
                  precio_costo: item.precio * itemData.cantidad,
              });

              // Guardar la relación
              await maintenanceInventoryRepository.save(newItem);

              total += item.precio * itemData.cantidad;
          }
      }

      // Actualizar factura
      const invoiceRepository = AppDataSource.getRepository(Invoice);
      const invoice = await invoiceRepository.findOne({ where: { id_mantenimiento: id } });
      if (invoice) {
          invoice.total = total;
          await invoiceRepository.save(invoice);
      }

      // Actualizar orden
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.findOne({ where: { id_mantenimiento: id } });
      if (order) {
          order.total = total;
          await orderRepository.save(order);
      }

      return { success: true, maintenance, invoice, order };
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

    // Devolver cantidades al inventario
    if (maintenance.items) {
      for (const item of maintenance.items) {
        const inventoryAdjustment = await ajustarInventario(item.id_item, item.cantidad);
        if (!inventoryAdjustment.success) {
          throw new Error(inventoryAdjustment.message);
        }
      }
    }

    // Eliminar relaciones con los ítems en MaintenanceInventory
    const maintenanceInventoryRepository = AppDataSource.getRepository(MaintenanceInventory);
    await maintenanceInventoryRepository.delete({ id_mantenimiento: maintenance.id_mantenimiento });

    // Eliminar la orden asociada, si existe
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
