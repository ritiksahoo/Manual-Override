import { type User, type InsertUser, type Customer, type InsertCustomer, type Loan, type InsertLoan, type Branch, type InsertBranch, type LoanDetails, type ApprovalRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  getLoan(id: string): Promise<Loan | undefined>;
  getLoanByRupeekId(rupeekLoanId: string): Promise<Loan | undefined>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanStatus(id: string, status: string, approvalData?: Partial<Loan>): Promise<Loan | undefined>;
  
  getBranch(id: string): Promise<Branch | undefined>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  
  getLoanDetails(rupeekLoanId: string): Promise<LoanDetails | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private customers: Map<string, Customer>;
  private loans: Map<string, Loan>;
  private branches: Map<string, Branch>;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.loans = new Map();
    this.branches = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample customer
    const customerId = randomUUID();
    const sampleCustomer: Customer = {
      id: customerId,
      name: "Kiran Kempegowda",
      fatherHusbandName: "Kempegowda",
      dob: "2 Mar 1985",
      gender: "Male",
      panNumber: "AWTPK2176N",
      phone: "9008551515",
      address: "# 49 2ND MAIN\nRR RESIDENCY OPP UPKAR LAYOUT\nWATER TANK,ULLAL,VISWANEEDAM\nBANGALORE North Bangalore\nKARNATAKA",
      pinCode: "560091",
      maritalStatus: "Married",
      annualIncome: 360000,
      profession: "Self",
      bankName: "RBL BANK",
      religion: "Hindu",
      ifscCode: "UTIB000RAZP",
      qualification: "Graduate",
      accountNumber: "222300962215223235",
    };
    this.customers.set(customerId, sampleCustomer);

    // Create sample branch
    const branchId = randomUUID();
    const sampleBranch: Branch = {
      id: branchId,
      solId: "NA",
      name: "Jayanagar",
      address: "4th Block, 28th Cross, 10th Main Road, Jayanagar, Bengaluru, Karnataka 560011 Bangalore Jayanagar 560011",
    };
    this.branches.set(branchId, sampleBranch);

    // Create sample loan
    const loanId = randomUUID();
    const sampleLoan: Loan = {
      id: loanId,
      rupeekLoanId: "7001910",
      customerId: customerId,
      loanDate: "18 Apr 2024",
      schemeName: "SIB- RUPEEK (Agri-6 Months )",
      totalAmount: 708654,
      interestRate: "22",
      perGramRate: "4654.4",
      penalInterestRate: "3",
      rupeekGoldRate: "5818",
      tenureMonths: 6,
      disbursalAmount: 708654,
      ltv: "80",
      processingFee: 0,
      disbursalCharges: 0,
      totalGrossWeight: "165.56",
      totalNetWeight: "152.86",
      totalAdjustment: "12.70",
      jewelryItems: ["Necklace", "Bangle", "Bangle", "Bangle", "Necklace", "Finger Ring", "Finger Ring", "Ear rings"],
      status: "rejected",
      rejectionReasons: ["Insufficient income verification documents", "Jewelry valuation below minimum threshold", "Credit score does not meet policy requirements"],
      approvalComment: null,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date(),
    };
    this.loans.set(loanId, sampleLoan);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    return this.loans.get(id);
  }

  async getLoanByRupeekId(rupeekLoanId: string): Promise<Loan | undefined> {
    return Array.from(this.loans.values()).find(
      (loan) => loan.rupeekLoanId === rupeekLoanId,
    );
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const id = randomUUID();
    const loan: Loan = { ...insertLoan, id, createdAt: new Date() };
    this.loans.set(id, loan);
    return loan;
  }

  async updateLoanStatus(id: string, status: string, approvalData?: Partial<Loan>): Promise<Loan | undefined> {
    const loan = this.loans.get(id);
    if (!loan) return undefined;

    const updatedLoan: Loan = {
      ...loan,
      status,
      ...approvalData,
    };
    
    this.loans.set(id, updatedLoan);
    return updatedLoan;
  }

  async getBranch(id: string): Promise<Branch | undefined> {
    return this.branches.get(id);
  }

  async createBranch(insertBranch: InsertBranch): Promise<Branch> {
    const id = randomUUID();
    const branch: Branch = { ...insertBranch, id };
    this.branches.set(id, branch);
    return branch;
  }

  async getLoanDetails(rupeekLoanId: string): Promise<LoanDetails | undefined> {
    const loan = await this.getLoanByRupeekId(rupeekLoanId);
    if (!loan) return undefined;

    const customer = await this.getCustomer(loan.customerId);
    if (!customer) return undefined;

    // For simplicity, use the first branch (in a real app, would be associated with the loan)
    const branch = Array.from(this.branches.values())[0];
    if (!branch) return undefined;

    return { loan, customer, branch };
  }
}

export const storage = new MemStorage();
