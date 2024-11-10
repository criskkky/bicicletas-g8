import { EntitySchema } from "typeorm";

const MaintenanceStatus = {
  PENDING: "pendiente",
  IN_PROCESS: "en proceso",
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
