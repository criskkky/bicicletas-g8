import { EntitySchema } from "typeorm";

const MaintenanceInventorySchema = new EntitySchema({
  name: "MaintenanceInventory",
  tableName: "mantenimiento_inventario",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_item: {
      type: "int",
      nullable: false,
    },
    id_mantenimiento: {
      type: "int",
      nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    precio_costo: {
      type: "decimal",
      nullable: false,
    },
  },
  relations: {
    maintenance: {
      target: "Maintenance",
      type: "many-to-one",
      joinColumn: { name: "id_mantenimiento" },
      onDelete: "CASCADE",
    },
    inventoryItem: {
      target: "Inventory",
      type: "many-to-one",
      joinColumn: { name: "id_item" },
      onDelete: "CASCADE",
    },
  },
});

export default MaintenanceInventorySchema;
