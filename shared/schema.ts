import { pgTable, text, serial, integer, decimal, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(), // apartment, villa, commercial, office
  rooms: integer("rooms"),
  area: decimal("area", { precision: 10, scale: 2 }),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  ownerEmail: text("owner_email"),
  description: text("description"),
  isAvailable: boolean("is_available").default(true),
});

// Tenants table
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  nationalId: text("national_id"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  occupation: text("occupation"),
  notes: text("notes"),
});

// Rental contracts table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
});

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  dueDate: date("due_date").notNull(),
  paymentMethod: text("payment_method"), // cash, check, transfer
  referenceNumber: text("reference_number"),
  notes: text("notes"),
  isLate: boolean("is_late").default(false),
});

// Expenses table  
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  contractId: integer("contract_id"), // optional, can be linked to specific contract
  category: text("category").notNull(), // maintenance, legal, insurance, utilities, other
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  vendor: text("vendor"), // supplier or service provider
  receiptNumber: text("receipt_number"),
  notes: text("notes"),
  isRecurring: boolean("is_recurring").default(false),
});

// Schema validation for expenses
export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
});

// Types for expenses
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

// Extended types with relationships
export type ExpenseWithDetails = Expense & {
  property: Property;
  contract?: ContractWithDetails;
};

// Insert schemas
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
});

// Types
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Extended types for joined data
export type PropertyWithOwner = Property;
export type ContractWithDetails = Contract & {
  property: Property;
  tenant: Tenant;
};
export type PaymentWithDetails = Payment & {
  contract: ContractWithDetails;
};
