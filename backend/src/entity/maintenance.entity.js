import { EntitySchema } from "typeorm";

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
      type: "varchar",
      length: 50,
      nullable: false,
      default: "pendiente",
    },
    date: {
      type: "timestamp with time zone",
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
    inventoryItems: {
      target: "MaintenanceInventory",
      type: "one-to-many",
      inverseSide: "maintenance",
      cascade: true,
    },
  },
});

export default MaintenanceSchema;
