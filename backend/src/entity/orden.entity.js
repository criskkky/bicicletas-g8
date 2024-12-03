"use strict";
import { EntitySchema } from "typeorm";

const OrderSchema = new EntitySchema({
  name: "Orden",
  tableName: "ordenes",
  columns: {
    id_orden: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_factura: {  // Añadido el ID de factura para cumplir con el MER
      type: "int",
      nullable: false,
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
    estado_orden: { // Añadido para representar el estado de la orden
      type: "enum",
      enum: ["pendiente", "en proceso", "completada"],
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
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "rut",
      },
    },
    factura: {
      target: "Factura",
      type: "one-to-one",
      joinColumn: {
        name: "id_factura",
      },
    },
    mantenimiento: {
      target: "Mantenimiento",
      type: "many-to-one",
      joinColumn: {
        name: "id_mantenimiento",
        nullable: true,
      },
    },
    venta: {
      target: "Venta",
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
