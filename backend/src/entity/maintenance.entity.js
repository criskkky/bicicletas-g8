import { EntitySchema } from "typeorm";

const MaintenanceStatus = {
  PENDING: "pendiente",
  IN_PROCESS: "en_proceso",
  COMPLETED: "completado",
};

const MaintenanceSchema = new EntitySchema({
  name: "Maintenance",
  tableName: "maintenance",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    description: {
      type: "varchar",
      length: 500,
      nullable: false,
    },
    technician: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    status: {
      type: "enum",
      enum: MaintenanceStatus,
      default: MaintenanceStatus.PENDING,
      nullable: false,
    },
    date: {
      type: "date",
      nullable: false,
    },
    idItemUsed: { // id del artículo de inventario usado
      type: "int",
      nullable: false,
    },
    quantityUsed: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    // Relación con el artículo de inventario
    inventoryItems: { // Nota el cambio a plural
      target: "Inventory",
      type: "many-to-many", // Relación muchos a muchos
      joinTable: { // Define la tabla de unión explícitamente
        name: "maintenance_inventory", // Nombre de la tabla de unión
        joinColumn: {
          name: "maintenance_id", // Columna de la tabla `Maintenance`
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "inventory_id", // Columna de la tabla `Inventory`
          referencedColumnName: "id",
        },
      },
    },
    invoice: {
      target: "Invoice",
      type: "one-to-one",
      joinColumn: true,
    },
  },
  indices: [
    {
      name: "IDX_MAINTENANCE",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default MaintenanceSchema;
