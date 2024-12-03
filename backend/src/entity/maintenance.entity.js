import { EntitySchema } from "typeorm";

const MaintenanceSchema = new EntitySchema({
  name: "Maintenance",
  tableName: "mantenimiento",
  columns: {
    id_mantenimiento: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_cliente: {
      type: "int",
      nullable: false,
    },
    rut: { // del trabajador
      type: "int",
      nullable: false,
    },
    fecha_mantenimiento: {
      type: "date",
      nullable: false,
    },
    descripcion: {
      type: "text",
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
      target: "MaintenanceInventory",
      type: "one-to-many",
      inverseSide: "maintenances",
      cascade: true, // el eliminar un mantenimiento, los quita de la tabla intermedia y revierte el stock en backend.
    },
    usersRut: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "rut" },
      inverseSide: "maintenances",
      cascade: false, // el eliminar un mantenimiento no elimina al usuario.
    },
  },
});

export default MaintenanceSchema;
