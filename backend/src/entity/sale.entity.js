import { EntitySchema } from "typeorm";

const SaleSchema = new EntitySchema({
  name: "Sale",
  tableName: "venta",
  columns: {
    id_venta: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_cliente: {
      type: "int",
      nullable: false,
    },
    fecha_venta: {
      type: "date",
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    tipo_venta: {
      type: "enum",
      enum: ["venta", "mantenimiento"],
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
    inventoryItems: {
      target: "VentaInventario",
      type: "one-to-many",
      inverseSide: "venta",
      joinColumn: {
        name: "id_venta",
        referencedColumnName: "id_venta",
      },
    },
  },  
  indices: [
    {
      name: "IDX_VENTA",
      columns: ["id_venta"],
      unique: true,
    },
  ],
});

export default SaleSchema;
