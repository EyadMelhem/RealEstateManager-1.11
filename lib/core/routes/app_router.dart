import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/properties/presentation/pages/properties_page.dart';
import '../../features/properties/presentation/pages/add_property_page.dart';
import '../../features/tenants/presentation/pages/tenants_page.dart';
import '../../features/tenants/presentation/pages/add_tenant_page.dart';
import '../../features/contracts/presentation/pages/contracts_page.dart';
import '../../features/contracts/presentation/pages/add_contract_page.dart';
import '../../features/payments/presentation/pages/payments_page.dart';
import '../../features/payments/presentation/pages/add_payment_page.dart';
import '../../features/expenses/presentation/pages/expenses_page.dart';
import '../../features/expenses/presentation/pages/add_expense_page.dart';
import '../../shared/widgets/main_layout.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    routes: [
      ShellRoute(
        builder: (context, state, child) {
          return MainLayout(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            name: 'dashboard',
            builder: (context, state) => const DashboardPage(),
          ),
          GoRoute(
            path: '/properties',
            name: 'properties',
            builder: (context, state) => const PropertiesPage(),
            routes: [
              GoRoute(
                path: '/add',
                name: 'add-property',
                builder: (context, state) => const AddPropertyPage(),
              ),
              GoRoute(
                path: '/edit/:id',
                name: 'edit-property',
                builder: (context, state) {
                  final id = int.parse(state.pathParameters['id']!);
                  return AddPropertyPage(propertyId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: '/tenants',
            name: 'tenants',
            builder: (context, state) => const TenantsPage(),
            routes: [
              GoRoute(
                path: '/add',
                name: 'add-tenant',
                builder: (context, state) => const AddTenantPage(),
              ),
              GoRoute(
                path: '/edit/:id',
                name: 'edit-tenant',
                builder: (context, state) {
                  final id = int.parse(state.pathParameters['id']!);
                  return AddTenantPage(tenantId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: '/contracts',
            name: 'contracts',
            builder: (context, state) => const ContractsPage(),
            routes: [
              GoRoute(
                path: '/add',
                name: 'add-contract',
                builder: (context, state) => const AddContractPage(),
              ),
              GoRoute(
                path: '/edit/:id',
                name: 'edit-contract',
                builder: (context, state) {
                  final id = int.parse(state.pathParameters['id']!);
                  return AddContractPage(contractId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: '/payments',
            name: 'payments',
            builder: (context, state) => const PaymentsPage(),
            routes: [
              GoRoute(
                path: '/add',
                name: 'add-payment',
                builder: (context, state) => const AddPaymentPage(),
              ),
              GoRoute(
                path: '/edit/:id',
                name: 'edit-payment',
                builder: (context, state) {
                  final id = int.parse(state.pathParameters['id']!);
                  return AddPaymentPage(paymentId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: '/expenses',
            name: 'expenses',
            builder: (context, state) => const ExpensesPage(),
            routes: [
              GoRoute(
                path: '/add',
                name: 'add-expense',
                builder: (context, state) => const AddExpensePage(),
              ),
              GoRoute(
                path: '/edit/:id',
                name: 'edit-expense',
                builder: (context, state) {
                  final id = int.parse(state.pathParameters['id']!);
                  return AddExpensePage(expenseId: id);
                },
              ),
            ],
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'الصفحة غير موجودة',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'المسار المطلوب غير متاح',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('العودة للرئيسية'),
            ),
          ],
        ),
      ),
    ),
  );
}