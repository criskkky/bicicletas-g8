"use strict";
import { EntitySchema } from "typeorm";

const MaintenanceInventorySchema = new EntitySchema({
  name: "MantenimientoInventario",
  tableName: "mantenimiento_inventario",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_item: {
      type: "int",
      nullable: false,
    },
    id_mantenimiento: {
      type: "int",
      nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    precio_costo: {
      type: "decimal",
      nullable: false,
    },
  },
  relations: {
    mantenimiento: {
      target: "Mantenimiento",
      type: "many-to-one",
      joinColumn: { name: "id_mantenimiento" },
      onDelete: "CASCADE", // Manteniendo la opción de eliminar en cascada como estaba definido
    },
    item: {
      target: "Inventario",
      type: "many-to-one",
      joinColumn: { name: "id_item" },
      onDelete: "CASCADE", // Manteniendo la opción de eliminar en cascada como estaba definido
    },
  },
});

export default MaintenanceInventorySchema;