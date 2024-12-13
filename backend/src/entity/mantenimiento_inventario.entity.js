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
      joinColumn: { name: "id_mantenimiento", referencedColumnName: "id_mantenimiento" },
      inverseSide: "items",
      onDelete: "CASCADE",
    },
    items: {
      target: "Inventario",
      type: "many-to-one",
      joinColumn: { name: "id_item", referencedColumnName: "id_item" },
      inverseSide: "mantenimientoInventario",
      onDelete: "SET NULL",
    },
  },
  indices: [
    {
      name: "IDX_MNTINV",
      columns: ["id"],
    },
  ],
});

export default MaintenanceInventorySchema;
