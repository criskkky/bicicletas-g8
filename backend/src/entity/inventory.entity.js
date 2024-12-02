import { EntitySchema } from "typeorm";

const InventorySchema = new EntitySchema({
  name: "Inventory",
  tableName: "inventario",
  columns: {
    id_item: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    marca: {
      type: "text",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    precio: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    stock: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    maintenanceItems: {
      target: "MaintenanceInventory",
      type: "one-to-many",
      inverseSide: "inventoryItem",
    },
    sales: {
      target: "Sale",
      type: "one-to-many",
      inverseSide: "inventory",
    },
  },
  indices: [
    {
      name: "IDX_INVENTORY",
      columns: ["id_item"],
      unique: true,
    },
  ],
});

export default InventorySchema;
