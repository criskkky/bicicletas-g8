import { EntitySchema } from "typeorm";

const MaintenanceInventorySchema = new EntitySchema({
  name: "MaintenanceInventory",
  tableName: "maintenance_inventory",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    quantityUsed: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    maintenance: {
      target: "Maintenance",
      type: "many-to-one",
      joinColumn: { name: "maintenance_id" },
      onDelete: "CASCADE",
    },
    inventoryItem: {
      target: "Inventory",
      type: "many-to-one",
      joinColumn: { name: "inventory_id" },
      onDelete: "CASCADE",
    },
  },
});

export default MaintenanceInventorySchema;
