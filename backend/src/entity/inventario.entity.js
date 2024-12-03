"use strict";
import { EntitySchema } from "typeorm";

const InventorySchema = new EntitySchema({
  name: "Inventario",
  tableName: "inventario",
  columns: {
    id_item: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    marca: {
      type: "varchar", // Ajustado de 'text' a 'varchar' para alinearse con el MER
      length: 255,     // Añadida la longitud para alinearse con el MER
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    precio: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    stock: {
      type: "int",
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
    mantenimientoInventario: {
      target: "MantenimientoInventario",
      type: "one-to-many",
      inverseSide: "item",
    },
    ventaInventario: {
      target: "VentaInventario",
      type: "one-to-many",
      inverseSide: "item",
    },
  },
});

export default InventorySchema;
