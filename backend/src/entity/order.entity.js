import { EntitySchema } from "typeorm";

const OrderSchema = new EntitySchema({
  name: "Order",
  tableName: "ordenes",
  columns: {
    id_orden: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_mantenimiento: {
      type: "int",
      nullable: true,
    },
    id_venta: {
      type: "int",
      nullable: true,
    },
    fecha_orden: {
      type: "date",
      nullable: false,
    },
    tipo_orden: {
      type: "enum",
      enum: ["venta", "mantenimiento"],
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
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
    usersRut: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "rut",
      },
    },
    maintenance: {
      target: "Maintenance",
      type: "many-to-one",
      joinColumn: {
        name: "id_mantenimiento",
        nullable: true,
      },
    },
    sale: {
      target: "Sale",
      type: "many-to-one",
      joinColumn: {
        name: "id_venta",
        nullable: true,
      },
    },
  },
  indices: [
    {
      name: "IDX_ORDENES",
      columns: ["id_orden"],
      unique: true,
    },
  ],
});

export default OrderSchema;
