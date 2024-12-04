"use strict";
import { EntitySchema } from "typeorm";

const SaleSchema = new EntitySchema({
  name: "Venta",
  tableName: "venta",
  columns: {
    rut_trabajador: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    id_venta: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut_cliente: {
      type: "varchar",
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
      joinColumn: { name: "rut_trabajador", referencedColumnName: "rut" },
      inverseSide: "ordenes",
      onDelete: "RESTRICT", // No se puede eliminar un trabajador si tiene mantenimientos asociados
    },
    items: {  // Relación con VentaInventario
      target: "VentaInventario",
      type: "one-to-many",
      inverseSide: "venta",
      onDelete: "CASCADE", // Si se elimina una venta también todos los registros de VentaInventario asociados.
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
