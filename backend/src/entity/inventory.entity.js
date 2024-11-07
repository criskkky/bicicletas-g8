import { EntitySchema } from "typeorm";

const InventorySchema = new EntitySchema({
  name: "Inventory",
  tableName: "inventory",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    type: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    quantity: {
      type: "int",
      nullable: false,
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    sales: { 
      target: "Sale",
      property: "inventoryItem",
      type: "one-to-many", 
      inverseSide: "InventoryItem",
    },
  },
  indices: [
    {
      name: "IDX_INVENTORY",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default InventorySchema;
