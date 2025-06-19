// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  properties;
  tenants;
  contracts;
  payments;
  expenses;
  currentIds;
  constructor() {
    this.properties = /* @__PURE__ */ new Map();
    this.tenants = /* @__PURE__ */ new Map();
    this.contracts = /* @__PURE__ */ new Map();
    this.payments = /* @__PURE__ */ new Map();
    this.expenses = /* @__PURE__ */ new Map();
    this.currentIds = {
      properties: 1,
      tenants: 1,
      contracts: 1,
      payments: 1,
      expenses: 1
    };
  }
  // Properties
  async getProperties() {
    return Array.from(this.properties.values());
  }
  async getProperty(id) {
    return this.properties.get(id);
  }
  async createProperty(insertProperty) {
    const id = this.currentIds.properties++;
    const property = {
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
  async updateProperty(id, updates) {
    const property = this.properties.get(id);
    if (!property) return void 0;
    const updatedProperty = { ...property, ...updates };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  async deleteProperty(id) {
    return this.properties.delete(id);
  }
  // Tenants
  async getTenants() {
    return Array.from(this.tenants.values());
  }
  async getTenant(id) {
    return this.tenants.get(id);
  }
  async createTenant(insertTenant) {
    const id = this.currentIds.tenants++;
    const tenant = {
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
  async updateTenant(id, updates) {
    const tenant = this.tenants.get(id);
    if (!tenant) return void 0;
    const updatedTenant = { ...tenant, ...updates };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }
  async deleteTenant(id) {
    return this.tenants.delete(id);
  }
  // Contracts
  async getContracts() {
    const contractsWithDetails = [];
    for (const contract of this.contracts.values()) {
      const property = this.properties.get(contract.propertyId);
      const tenant = this.tenants.get(contract.tenantId);
      if (property && tenant) {
        contractsWithDetails.push({
          ...contract,
          property,
          tenant
        });
      }
    }
    return contractsWithDetails;
  }
  async getContract(id) {
    const contract = this.contracts.get(id);
    if (!contract) return void 0;
    const property = this.properties.get(contract.propertyId);
    const tenant = this.tenants.get(contract.tenantId);
    if (!property || !tenant) return void 0;
    return {
      ...contract,
      property,
      tenant
    };
  }
  async createContract(insertContract) {
    const id = this.currentIds.contracts++;
    const contract = {
      ...insertContract,
      id,
      notes: insertContract.notes ?? null,
      securityDeposit: insertContract.securityDeposit ?? null,
      isActive: insertContract.isActive ?? null
    };
    this.contracts.set(id, contract);
    return contract;
  }
  async updateContract(id, updates) {
    const contract = this.contracts.get(id);
    if (!contract) return void 0;
    const updatedContract = { ...contract, ...updates };
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }
  async deleteContract(id) {
    return this.contracts.delete(id);
  }
  async getActiveContracts() {
    const allContracts = await this.getContracts();
    return allContracts.filter((contract) => contract.isActive);
  }
  // Payments
  async getPayments() {
    const paymentsWithDetails = [];
    for (const payment of this.payments.values()) {
      const contractWithDetails = await this.getContract(payment.contractId);
      if (contractWithDetails) {
        paymentsWithDetails.push({
          ...payment,
          contract: contractWithDetails
        });
      }
    }
    return paymentsWithDetails;
  }
  async getPayment(id) {
    const payment = this.payments.get(id);
    if (!payment) return void 0;
    const contractWithDetails = await this.getContract(payment.contractId);
    if (!contractWithDetails) return void 0;
    return {
      ...payment,
      contract: contractWithDetails
    };
  }
  async createPayment(insertPayment) {
    const id = this.currentIds.payments++;
    const payment = {
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
  async updatePayment(id, updates) {
    const payment = this.payments.get(id);
    if (!payment) return void 0;
    const updatedPayment = { ...payment, ...updates };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  async deletePayment(id) {
    return this.payments.delete(id);
  }
  async getOverduePayments() {
    const allPayments = await this.getPayments();
    const today = /* @__PURE__ */ new Date();
    return allPayments.filter((payment) => {
      const dueDate = new Date(payment.dueDate);
      return dueDate < today;
    });
  }
  async getPaymentsByContract(contractId) {
    const allPayments = await this.getPayments();
    return allPayments.filter((payment) => payment.contractId === contractId);
  }
  async getDashboardStats() {
    const totalProperties = this.properties.size;
    const activeContracts = await this.getActiveContracts();
    const activeTenants = activeContracts.length;
    const monthlyRevenue = activeContracts.reduce((total, contract) => {
      return total + parseFloat(contract.monthlyRent || "0");
    }, 0);
    const overduePayments = (await this.getOverduePayments()).length;
    return {
      totalProperties,
      activeTenants,
      monthlyRevenue,
      overduePayments
    };
  }
  // Expenses methods
  async getExpenses() {
    const expensesList = Array.from(this.expenses.values());
    const expensesWithDetails = [];
    for (const expense of expensesList) {
      const property = this.properties.get(expense.propertyId);
      if (property) {
        let contract = void 0;
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
  async getExpense(id) {
    const expense = this.expenses.get(id);
    if (!expense) return void 0;
    const property = this.properties.get(expense.propertyId);
    if (!property) return void 0;
    let contract = void 0;
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
  async createExpense(insertExpense) {
    const id = this.currentIds.expenses++;
    const expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }
  async updateExpense(id, updates) {
    const expense = this.expenses.get(id);
    if (!expense) return void 0;
    const updatedExpense = { ...expense, ...updates };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }
  async deleteExpense(id) {
    return this.expenses.delete(id);
  }
  async getExpensesByProperty(propertyId) {
    const allExpenses = await this.getExpenses();
    return allExpenses.filter((expense) => expense.propertyId === propertyId);
  }
  async getExpensesByContract(contractId) {
    const allExpenses = await this.getExpenses();
    return allExpenses.filter((expense) => expense.contractId === contractId);
  }
  async getExpensesByCategory(category) {
    const allExpenses = await this.getExpenses();
    return allExpenses.filter((expense) => expense.category === category);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, decimal, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(),
  // apartment, villa, commercial, office
  rooms: integer("rooms"),
  area: decimal("area", { precision: 10, scale: 2 }),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  ownerEmail: text("owner_email"),
  description: text("description"),
  isAvailable: boolean("is_available").default(true)
});
var tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  nationalId: text("national_id"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  occupation: text("occupation"),
  notes: text("notes")
});
var contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  notes: text("notes")
});
var payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  dueDate: date("due_date").notNull(),
  paymentMethod: text("payment_method"),
  // cash, check, transfer
  referenceNumber: text("reference_number"),
  notes: text("notes"),
  isLate: boolean("is_late").default(false)
});
var expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  contractId: integer("contract_id"),
  // optional, can be linked to specific contract
  category: text("category").notNull(),
  // maintenance, legal, insurance, utilities, other
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  vendor: text("vendor"),
  // supplier or service provider
  receiptNumber: text("receipt_number"),
  notes: text("notes"),
  isRecurring: boolean("is_recurring").default(false)
});
var insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true
});
var insertTenantSchema = createInsertSchema(tenants).omit({
  id: true
});
var insertContractSchema = createInsertSchema(contracts).omit({
  id: true
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/properties", async (req, res) => {
    try {
      const properties2 = await storage.getProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });
  app2.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });
  app2.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(id, validatedData);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });
  app2.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProperty(id);
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });
  app2.get("/api/tenants", async (req, res) => {
    try {
      const tenants2 = await storage.getTenants();
      res.json(tenants2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });
  app2.get("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenant = await storage.getTenant(id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tenant" });
    }
  });
  app2.post("/api/tenants", async (req, res) => {
    try {
      const validatedData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(validatedData);
      res.status(201).json(tenant);
    } catch (error) {
      res.status(400).json({ message: "Invalid tenant data" });
    }
  });
  app2.put("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTenantSchema.partial().parse(req.body);
      const tenant = await storage.updateTenant(id, validatedData);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      res.status(400).json({ message: "Invalid tenant data" });
    }
  });
  app2.delete("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTenant(id);
      if (!deleted) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tenant" });
    }
  });
  app2.get("/api/contracts", async (req, res) => {
    try {
      const contracts2 = await storage.getContracts();
      res.json(contracts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });
  app2.get("/api/contracts/active", async (req, res) => {
    try {
      const contracts2 = await storage.getActiveContracts();
      res.json(contracts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active contracts" });
    }
  });
  app2.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });
  app2.post("/api/contracts", async (req, res) => {
    try {
      const validatedData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(validatedData);
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid contract data" });
    }
  });
  app2.put("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContractSchema.partial().parse(req.body);
      const contract = await storage.updateContract(id, validatedData);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid contract data" });
    }
  });
  app2.delete("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContract(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });
  app2.get("/api/payments", async (req, res) => {
    try {
      const payments2 = await storage.getPayments();
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  app2.get("/api/payments/overdue", async (req, res) => {
    try {
      const payments2 = await storage.getOverduePayments();
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overdue payments" });
    }
  });
  app2.get("/api/payments/contract/:contractId", async (req, res) => {
    try {
      const contractId = parseInt(req.params.contractId);
      const payments2 = await storage.getPaymentsByContract(contractId);
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments for contract" });
    }
  });
  app2.get("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const payment = await storage.getPayment(id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });
  app2.put("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(id, validatedData);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });
  app2.delete("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePayment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });
  app2.get("/api/expenses", async (req, res) => {
    try {
      const expenses2 = await storage.getExpenses();
      res.json(expenses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });
  app2.get("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const expense = await storage.getExpense(id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expense" });
    }
  });
  app2.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });
  app2.put("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, validatedData);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });
  app2.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteExpense(id);
      if (!deleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });
  app2.get("/api/expenses/property/:propertyId", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const expenses2 = await storage.getExpensesByProperty(propertyId);
      res.json(expenses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property expenses" });
    }
  });
  app2.get("/api/expenses/contract/:contractId", async (req, res) => {
    try {
      const contractId = parseInt(req.params.contractId);
      const expenses2 = await storage.getExpensesByContract(contractId);
      res.json(expenses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract expenses" });
    }
  });
  app2.get("/api/expenses/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const expenses2 = await storage.getExpensesByCategory(category);
      res.json(expenses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category expenses" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
