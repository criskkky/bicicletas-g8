import { EntitySchema } from "typeorm";

const InvoiceSchema = new EntitySchema({
  name: "Invoice",
  tableName: "invoice",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    totalAmount: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    issueDate: {
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
    maintenance: {
      target: "Maintenance",
      type: "one-to-one",
      cascade: true,
    },
  },
  indices: [
    {
      name: "IDX_INVOICE",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default InvoiceSchema;
