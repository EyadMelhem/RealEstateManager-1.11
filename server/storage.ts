import { 
  properties, tenants, contracts, payments, expenses,
  type Property, type InsertProperty,
  type Tenant, type InsertTenant, 
  type Contract, type InsertContract,
  type Payment, type InsertPayment,
  type Expense, type InsertExpense,
  type ContractWithDetails, type PaymentWithDetails, type ExpenseWithDetails
} from "@shared/schema";

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Tenants
  getTenants(): Promise<Tenant[]>;
  getTenant(id: number): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant | undefined>;
  deleteTenant(id: number): Promise<boolean>;

  // Contracts
  getContracts(): Promise<ContractWithDetails[]>;
  getContract(id: number): Promise<ContractWithDetails | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;
  getActiveContracts(): Promise<ContractWithDetails[]>;

  // Payments
  getPayments(): Promise<PaymentWithDetails[]>;
  getPayment(id: number): Promise<PaymentWithDetails | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;
  getOverduePayments(): Promise<PaymentWithDetails[]>;
  getPaymentsByContract(contractId: number): Promise<PaymentWithDetails[]>;

  // Expenses
  getExpenses(): Promise<ExpenseWithDetails[]>;
  getExpense(id: number): Promise<ExpenseWithDetails | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
  getExpensesByProperty(propertyId: number): Promise<ExpenseWithDetails[]>;
  getExpensesByContract(contractId: number): Promise<ExpenseWithDetails[]>;
  getExpensesByCategory(category: string): Promise<ExpenseWithDetails[]>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalProperties: number;
    activeTenants: number;
    monthlyRevenue: number;
    overduePayments: number;
  }>;
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private tenants: Map<number, Tenant>;
  private contracts: Map<number, Contract>;
  private payments: Map<number, Payment>;
  private expenses: Map<number, Expense>;
  private currentIds: {
    properties: number;
    tenants: number;
    contracts: number;
    payments: number;
    expenses: number;
  };

  constructor() {
    this.properties = new Map();
    this.tenants = new Map();
    this.contracts = new Map();
    this.payments = new Map();
    this.expenses = new Map();
    this.currentIds = {
      properties: 1,
      tenants: 1,
      contracts: 1,
      payments: 1,
      expenses: 1,
    };
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentIds.properties++;
    const property: Property = { 
      ...insertProperty, 
      id,
      rooms: insertProperty.rooms ?? null,
      area: insertProperty.area ?? null,
      ownerPhone: insertProperty.ownerPhone ?? null,
      ownerEmail: insertProperty.ownerEmail ?? null,
      description: insertProperty.description ?? null,
      isAvailable: insertProperty.isAvailable ?? null
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;

    const updatedProperty = { ...property, ...updates };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Tenants
  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async getTenant(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = this.currentIds.tenants++;
    const tenant: Tenant = { 
      ...insertTenant, 
      id,
      email: insertTenant.email ?? null,
      nationalId: insertTenant.nationalId ?? null,
      emergencyContact: insertTenant.emergencyContact ?? null,
      emergencyPhone: insertTenant.emergencyPhone ?? null,
      occupation: insertTenant.occupation ?? null,
      notes: insertTenant.notes ?? null
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async updateTenant(id: number, updates: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const tenant = this.tenants.get(id);
    if (!tenant) return undefined;

    const updatedTenant = { ...tenant, ...updates };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }

  async deleteTenant(id: number): Promise<boolean> {
    return this.tenants.delete(id);
  }

  // Contracts
  async getContracts(): Promise<ContractWithDetails[]> {
    const contractsWithDetails: ContractWithDetails[] = [];

    for (const contract of this.contracts.values()) {
      const property = this.properties.get(contract.propertyId);
      const tenant = this.tenants.get(contract.tenantId);

      if (property && tenant) {
        contractsWithDetails.push({
          ...contract,
          property,
          tenant,
        });
      }
    }

    return contractsWithDetails;
  }

  async getContract(id: number): Promise<ContractWithDetails | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;

    const property = this.properties.get(contract.propertyId);
    const tenant = this.tenants.get(contract.tenantId);

    if (!property || !tenant) return undefined;

    return {
      ...contract,
      property,
      tenant,
    };
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = this.currentIds.contracts++;
    const contract: Contract = { 
      ...insertContract, 
      id,
      notes: insertContract.notes ?? null,
      securityDeposit: insertContract.securityDeposit ?? null,
      isActive: insertContract.isActive ?? null
    };
    this.contracts.set(id, contract);
    return contract;
  }

  async updateContract(id: number, updates: Partial<InsertContract>): Promise<Contract | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;

    const updatedContract = { ...contract, ...updates };
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }

  async deleteContract(id: number): Promise<boolean> {
    return this.contracts.delete(id);
  }

  async getActiveContracts(): Promise<ContractWithDetails[]> {
    const allContracts = await this.getContracts();
    return allContracts.filter(contract => contract.isActive);
  }

  // Payments
  async getPayments(): Promise<PaymentWithDetails[]> {
    const paymentsWithDetails: PaymentWithDetails[] = [];

    for (const payment of this.payments.values()) {
      const contractWithDetails = await this.getContract(payment.contractId);

      if (contractWithDetails) {
        paymentsWithDetails.push({
          ...payment,
          contract: contractWithDetails,
        });
      }
    }

    return paymentsWithDetails;
  }

  async getPayment(id: number): Promise<PaymentWithDetails | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const contractWithDetails = await this.getContract(payment.contractId);
    if (!contractWithDetails) return undefined;

    return {
      ...payment,
      contract: contractWithDetails,
    };
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentIds.payments++;
    const payment: Payment = { 
      ...insertPayment, 
      id,
      notes: insertPayment.notes ?? null,
      paymentMethod: insertPayment.paymentMethod ?? null,
      referenceNumber: insertPayment.referenceNumber ?? null,
      isLate: insertPayment.isLate ?? null
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updatedPayment = { ...payment, ...updates };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.payments.delete(id);
  }

  async getOverduePayments(): Promise<PaymentWithDetails[]> {
    const allPayments = await this.getPayments();
    const today = new Date();

    return allPayments.filter(payment => {
      const dueDate = new Date(payment.dueDate);
      return dueDate < today;
    });
  }

  async getPaymentsByContract(contractId: number): Promise<PaymentWithDetails[]> {
    const allPayments = await this.getPayments();
    return allPayments.filter(payment => payment.contractId === contractId);
  }

  async getDashboardStats(): Promise<{
    totalProperties: number;
    activeTenants: number;
    monthlyRevenue: number;
    overduePayments: number;
  }> {
    const totalProperties = this.properties.size;
    const activeContracts = await this.getActiveContracts();
    const activeTenants = activeContracts.length;

    const monthlyRevenue = activeContracts.reduce((total, contract) => {
      return total + parseFloat(contract.monthlyRent || '0');
    }, 0);

    const overduePayments = (await this.getOverduePayments()).length;

    return {
      totalProperties,
      activeTenants,
      monthlyRevenue,
      overduePayments,
    };
  }

  // Expenses methods
  async getExpenses(): Promise<ExpenseWithDetails[]> {
    const expensesList = Array.from(this.expenses.values());
    const expensesWithDetails = [];

    for (const expense of expensesList) {
      const property = this.properties.get(expense.propertyId);
      if (property) {
        let contract = undefined;
        if (expense.contractId) {
          const contractData = this.contracts.get(expense.contractId);
          if (contractData) {
            const tenant = this.tenants.get(contractData.tenantId);
            if (tenant) {
              contract = { ...contractData, property, tenant };
            }
          }
        }
        expensesWithDetails.push({ ...expense, property, contract });
      }
    }

    return expensesWithDetails;
  }

  async getExpense(id: number): Promise<ExpenseWithDetails | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    const property = this.properties.get(expense.propertyId);
    if (!property) return undefined;

    let contract = undefined;
    if (expense.contractId) {
      const contractData = this.contracts.get(expense.contractId);
      if (contractData) {
        const tenant = this.tenants.get(contractData.tenantId);
        if (tenant) {
          contract = { ...contractData, property, tenant };
        }
      }
    }

    return { ...expense, property, contract };
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentIds.expenses++;
    const expense: Expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    const updatedExpense = { ...expense, ...updates };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  async getExpensesByProperty(propertyId: number): Promise<ExpenseWithDetails[]> {
    const allExpenses = await this.getExpenses();
    return allExpenses.filter(expense => expense.propertyId === propertyId);
  }

  async getExpensesByContract(contractId: number): Promise<ExpenseWithDetails[]> {
    const allExpenses = await this.getExpenses();
    return allExpenses.filter(expense => expense.contractId === contractId);
  }

  async getExpensesByCategory(category: string): Promise<ExpenseWithDetails[]> {
    const allExpenses = await this.getExpenses();
    return allExpenses.filter(expense => expense.category === category);
  }
}

export const storage = new MemStorage();
