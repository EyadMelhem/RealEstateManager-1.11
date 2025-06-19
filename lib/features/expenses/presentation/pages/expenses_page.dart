import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../bloc/expenses_bloc.dart';

class ExpensesPage extends StatefulWidget {
  const ExpensesPage({super.key});

  @override
  State<ExpensesPage> createState() => _ExpensesPageState();
}

class _ExpensesPageState extends State<ExpensesPage> {
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    context.read<ExpensesBloc>().add(LoadExpenses());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة المصاريف'),
        actions: [
          IconButton(
            onPressed: () => context.go('/expenses/add'),
            icon: const Icon(LucideIcons.plus),
          ),
        ],
      ),
      body: BlocConsumer<ExpensesBloc, ExpensesState>(
        listener: (context, state) {
          if (state is ExpenseOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.successColor),
              ),
            );
          } else if (state is ExpensesError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.errorColor),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is ExpensesLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is ExpensesError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    LucideIcons.alertCircle,
                    size: 64.sp,
                    color: const Color(AppConstants.errorColor),
                  ),
                  SizedBox(height: 16.h),
                  Text(
                    'حدث خطأ في تحميل المصاريف',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 16.h),
                  ElevatedButton(
                    onPressed: () {
                      context.read<ExpensesBloc>().add(LoadExpenses());
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is ExpensesLoaded) {
            return Column(
              children: [
                // Summary cards
                Container(
                  padding: EdgeInsets.all(16.w),
                  child: Row(
                    children: [
                      Expanded(
                        child: AppCard(
                          padding: EdgeInsets.all(16.w),
                          child: Column(
                            children: [
                              Icon(
                                LucideIcons.trendingDown,
                                size: 32.sp,
                                color: const Color(AppConstants.errorColor),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                '${state.totalAmount.toStringAsFixed(0)} ${AppConstants.currency}',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(AppConstants.errorColor),
                                ),
                              ),
                              Text(
                                'إجمالي المصاريف',
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(width: 16.w),
                      Expanded(
                        child: AppCard(
                          padding: EdgeInsets.all(16.w),
                          child: Column(
                            children: [
                              Icon(
                                LucideIcons.calendar,
                                size: 32.sp,
                                color: const Color(AppConstants.warningColor),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                '${state.monthlyTotal.toStringAsFixed(0)} ${AppConstants.currency}',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(AppConstants.warningColor),
                                ),
                              ),
                              Text(
                                'هذا الشهر',
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Category filter
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 16.w),
                  child: DropdownButtonFormField<String>(
                    value: _selectedCategory,
                    decoration: const InputDecoration(
                      labelText: 'فلترة حسب الفئة',
                      prefixIcon: Icon(LucideIcons.filter),
                    ),
                    items: [
                      const DropdownMenuItem<String>(
                        value: null,
                        child: Text('جميع الفئات'),
                      ),
                      ...AppConstants.expenseCategories.map(
                        (category) => DropdownMenuItem<String>(
                          value: category,
                          child: Text(category),
                        ),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() {
                        _selectedCategory = value;
                      });
                      context.read<ExpensesBloc>().add(
                            FilterExpensesByCategory(value),
                          );
                    },
                  ),
                ),

                SizedBox(height: 16.h),

                // Expenses list
                Expanded(
                  child: state.filteredExpenses.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                LucideIcons.receipt,
                                size: 64.sp,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 16.h),
                              Text(
                                'لا توجد مصاريف',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                'ابدأ بتسجيل مصروف جديد',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Colors.grey[500],
                                ),
                              ),
                              SizedBox(height: 16.h),
                              ElevatedButton.icon(
                                onPressed: () => context.go('/expenses/add'),
                                icon: const Icon(LucideIcons.plus),
                                label: const Text('تسجيل مصروف'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.symmetric(horizontal: 16.w),
                          itemCount: state.filteredExpenses.length,
                          itemBuilder: (context, index) {
                            final expenseWithDetails = state.filteredExpenses[index];
                            final expense = expenseWithDetails.expense;
                            final property = expenseWithDetails.property;

                            return AppCard(
                              onTap: () => context.go('/expenses/edit/${expense.id}'),
                              child: Padding(
                                padding: EdgeInsets.all(16.w),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding: EdgeInsets.all(12.w),
                                          decoration: BoxDecoration(
                                            color: _getCategoryColor(expense.category).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(12.r),
                                          ),
                                          child: Icon(
                                            _getCategoryIcon(expense.category),
                                            color: _getCategoryColor(expense.category),
                                            size: 24.sp,
                                          ),
                                        ),
                                        SizedBox(width: 16.w),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                expense.description,
                                                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              SizedBox(height: 4.h),
                                              Text(
                                                expense.category,
                                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                                  color: _getCategoryColor(expense.category),
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Text(
                                          '${expense.amount.toStringAsFixed(0)} ${AppConstants.currency}',
                                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                            fontWeight: FontWeight.bold,
                                            color: const Color(AppConstants.errorColor),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 12.h),
                                    
                                    Row(
                                      children: [
                                        Icon(
                                          LucideIcons.building,
                                          size: 16.sp,
                                          color: Colors.grey[600],
                                        ),
                                        SizedBox(width: 8.w),
                                        Expanded(
                                          child: Text(
                                            property.title,
                                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 4.h),
                                    
                                    Row(
                                      children: [
                                        Icon(
                                          LucideIcons.calendar,
                                          size: 16.sp,
                                          color: Colors.grey[600],
                                        ),
                                        SizedBox(width: 8.w),
                                        Text(
                                          _formatDate(expense.expenseDate),
                                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                    
                                    if (expense.vendor != null) ...[
                                      SizedBox(height: 4.h),
                                      Row(
                                        children: [
                                          Icon(
                                            LucideIcons.store,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Text(
                                            'المورد: ${expense.vendor!}',
                                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    
                                    SizedBox(height: 12.h),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.end,
                                      children: [
                                        IconButton(
                                          onPressed: () => context.go('/expenses/edit/${expense.id}'),
                                          icon: Icon(
                                            LucideIcons.edit,
                                            size: 20.sp,
                                            color: const Color(AppConstants.primaryColor),
                                          ),
                                        ),
                                        IconButton(
                                          onPressed: () => _showDeleteDialog(context, expense.id!),
                                          icon: Icon(
                                            LucideIcons.trash2,
                                            size: 20.sp,
                                            color: const Color(AppConstants.errorColor),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/expenses/add'),
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'صيانة':
        return const Color(AppConstants.warningColor);
      case 'قانونية':
        return const Color(AppConstants.errorColor);
      case 'تأمين':
        return const Color(AppConstants.infoColor);
      case 'نظافة':
        return const Color(AppConstants.successColor);
      default:
        return const Color(AppConstants.primaryColor);
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'صيانة':
        return LucideIcons.wrench;
      case 'قانونية':
        return LucideIcons.scale;
      case 'تأمين':
        return LucideIcons.shield;
      case 'نظافة':
        return LucideIcons.sparkles;
      default:
        return LucideIcons.receipt;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _showDeleteDialog(BuildContext context, int expenseId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('تأكيد الحذف'),
          content: const Text('هل أنت متأكد من حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<ExpensesBloc>().add(DeleteExpense(expenseId));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(AppConstants.errorColor),
              ),
              child: const Text('حذف'),
            ),
          ],
        );
      },
    );
  }
}