import { EntitySchema } from "typeorm";

const SaleSchema = new EntitySchema({
  name: "Sale",
  tableName: "sales",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    inventoryItemId: {
      type: "int",
      nullable: false,
    },
    quantity: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    inventoryItem: {
      target: "Inventory",
      type: "many-to-one",
      joinColumn: {
        name: "inventoryItemId",
        referencedColumnName: "id",
      },
    },
  },
  indices: [
    {
      name: "IDX_SALE",
      columns: ["id"],
      unique: true, 
    },
  ],
});

export default SaleSchema;
