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
    cantidad_ordenes_realizadas: { // Calculado en service.
      type: "int",
      nullable: false,
    },
    horas_trabajadas: { // Calculado en service. Gracias a la relación con Ordenes.
      type: "int",
      nullable: false,
    },
    fecha_pago: { // Establecer fecha de pago
      type: "date",
      nullable: false,
    },
    monto: { // Calculado en service.
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
    user: {  // Corregido para usar el nombre singular y adecuado
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "rut",
      },
    },
    order: {
      target: "Orden",
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
