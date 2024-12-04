"use strict";
import { EntitySchema } from "typeorm";

const PagosSchema = new EntitySchema({
  name: "Pago",
  tableName: "pago",
  columns: {
    id_pago: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut_trabajador: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    cantidad_ordenes_realizadas: {
      type: "int",
      nullable: false,
    },
    horas_trabajadas: {
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
    ordenes: {
      target: "Orden",
      type: "one-to-many",
      inverseSide: "pago",
      cascade: true,
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
