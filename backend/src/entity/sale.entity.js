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
    totalPrice: {
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
  },
  relations: {
    inventoryItem: { // Agregar relación con Inventory
      target: "Inventory",
      property: "inventoryItemId",
      type: "many-to-one", // O "one-to-many" dependiendo de la lógica
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
