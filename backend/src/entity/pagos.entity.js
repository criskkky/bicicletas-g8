import { EntitySchema } from "typeorm";

const PagosSchema = new EntitySchema({
  name: "Pagos",
  tableName: "pago",
  columns: {
    id_pago: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_orden: {
      type: "int",
      nullable: false,
    },
    cantidad_ordenes_realizadas: {
      type: "int",
      nullable: false,
    },
    fecha_pago: {
      type: "date",
      nullable: false,
    },
    monto: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    estado: {
      type: "enum",
      enum: ["pendiente", "realizado"],
      nullable: false,
    },
    metodo_pago: {
      type: "enum",
      enum: ["efectivo", "tarjeta", "transferencia"],
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
    order: {
      target: "Order",
      type: "many-to-one",
      joinColumn: {
        name: "id_orden",
      },
    },
  },  
  indices: [
    {
      name: "IDX_PAGO",
      columns: ["id_pago"],
      unique: true,
    },
  ],
});

export default PagosSchema;
