import { EntitySchema } from "typeorm";

const MaintenanceInventorySchema = new EntitySchema({
  name: "MaintenanceInventory",
  tableName: "maintenance_inventory",
  columns: {
    id: {  // ID autogenerado de la relación
      type: "int",
      primary: true,
      generated: true, // Esto asegura que el ID sea único para cada relación
    },
    inventory_id: { // ID del ítem en el inventario utilizado
      type: "int",
      nullable: false,
    },
    quantityUsed: { // Cantidad de inventario utilizada en la mantención
      type: "int",
      nullable: false,
    },
  },
  relations: {
    maintenance: {
      target: "Maintenance", // Relación con la tabla de Mantenimiento
      type: "many-to-one",
      joinColumn: { name: "maintenance_id" }, // El nombre de la columna de la relación
      onDelete: "CASCADE",
    },
    inventoryItem: {
      target: "Inventory",  // Relación con la tabla de Inventario
      type: "many-to-one",
      joinColumn: { name: "inventory_id" },
      onDelete: "CASCADE",
    },
  },
});

export default MaintenanceInventorySchema;
