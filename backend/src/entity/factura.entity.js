"use strict";
import { EntitySchema } from "typeorm";

const FacturaSchema = new EntitySchema({
  name: "Factura",
  tableName: "factura",
  columns: {
    id_factura: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_venta: {
      type: "int",
      nullable: true,
    },
    id_mantenimiento: {
      type: "int",
      nullable: true,
    },
    rut_trabajador: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    rut_cliente: {
      type: "varchar",
      nullable: false,
    },
    fecha_factura: {
      type: "date",
      nullable: false,
    },
    metodo_pago: {
      type: "enum",
      enum: ["efectivo", "tarjeta", "transferencia"],
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    tipo_factura: {
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
    venta: {
      target: "Venta",
      type: "many-to-one",
      joinColumn: { name: "id_venta", referencedColumnName: "id_venta" },
      onDelete: "CASCADE", // Si se elimina una venta también se elimina la factura asociada.
    },
    mantenimiento: {
      target: "Mantenimiento",
      type: "many-to-one",
      joinColumn: { name: "id_mantenimiento", referencedColumnName: "id_mantenimiento" },
      onDelete: "CASCADE", // Si se elimina un mantenimiento también se elimina la factura asociada.
    },
  },
});

export default FacturaSchema;
