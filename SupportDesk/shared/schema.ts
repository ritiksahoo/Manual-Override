import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fatherHusbandName: text("father_husband_name").notNull(),
  dob: text("dob").notNull(),
  gender: text("gender").notNull(),
  panNumber: text("pan_number").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  pinCode: text("pin_code").notNull(),
  maritalStatus: text("marital_status").notNull(),
  annualIncome: integer("annual_income").notNull(),
  profession: text("profession").notNull(),
  bankName: text("bank_name").notNull(),
  religion: text("religion").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  qualification: text("qualification").notNull(),
  accountNumber: text("account_number").notNull(),
});

export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rupeekLoanId: text("rupeek_loan_id").notNull().unique(),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  loanDate: text("loan_date").notNull(),
  schemeName: text("scheme_name").notNull(),
  totalAmount: integer("total_amount").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  perGramRate: decimal("per_gram_rate", { precision: 10, scale: 2 }).notNull(),
  penalInterestRate: decimal("penal_interest_rate", { precision: 5, scale: 2 }).notNull(),
  rupeekGoldRate: decimal("rupeek_gold_rate", { precision: 10, scale: 2 }).notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  disbursalAmount: integer("disbursal_amount").notNull(),
  ltv: decimal("ltv", { precision: 5, scale: 2 }).notNull(),
  processingFee: integer("processing_fee").notNull(),
  disbursalCharges: integer("disbursal_charges").notNull(),
  totalGrossWeight: decimal("total_gross_weight", { precision: 10, scale: 2 }).notNull(),
  totalNetWeight: decimal("total_net_weight", { precision: 10, scale: 2 }).notNull(),
  totalAdjustment: decimal("total_adjustment", { precision: 10, scale: 2 }).notNull(),
  jewelryItems: text("jewelry_items").array().notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReasons: text("rejection_reasons").array(),
  approvalComment: text("approval_comment"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  solId: text("sol_id"),
  name: text("name").notNull(),
  address: text("address").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
});

export const insertBranchSchema = createInsertSchema(branches).omit({
  id: true,
});

export const approvalSchema = z.object({
  loanId: z.string().min(1, "Loan ID is required"),
  comment: z.string().min(20, "Comment must be at least 20 characters"),
  approvedBy: z.string().min(1, "Approver ID is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;
export type ApprovalRequest = z.infer<typeof approvalSchema>;

export interface LoanDetails {
  loan: Loan;
  customer: Customer;
  branch: Branch;
}
