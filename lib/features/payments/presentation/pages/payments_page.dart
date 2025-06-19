import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../bloc/payments_bloc.dart';

class PaymentsPage extends StatefulWidget {
  const PaymentsPage({super.key});

  @override
  State<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<PaymentsPage> {
  @override
  void initState() {
    super.initState();
    context.read<PaymentsBloc>().add(LoadPayments());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة المدفوعات'),
        actions: [
          IconButton(
            onPressed: () => context.go('/payments/add'),
            icon: const Icon(LucideIcons.plus),
          ),
        ],
      ),
      body: BlocConsumer<PaymentsBloc, PaymentsState>(
        listener: (context, state) {
          if (state is PaymentOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.successColor),
              ),
            );
          } else if (state is PaymentsError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.errorColor),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is PaymentsLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is PaymentsError) {
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
                    'حدث خطأ في تحميل المدفوعات',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 16.h),
                  ElevatedButton(
                    onPressed: () {
                      context.read<PaymentsBloc>().add(LoadPayments());
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is PaymentsLoaded) {
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
                                LucideIcons.dollarSign,
                                size: 32.sp,
                                color: const Color(AppConstants.successColor),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                '${state.totalAmount.toStringAsFixed(0)} ${AppConstants.currency}',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(AppConstants.successColor),
                                ),
                              ),
                              Text(
                                'إجمالي المدفوعات',
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
                                LucideIcons.alertTriangle,
                                size: 32.sp,
                                color: const Color(AppConstants.errorColor),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                state.overduePayments.length.toString(),
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: const Color(AppConstants.errorColor),
                                ),
                              ),
                              Text(
                                'مدفوعات متأخرة',
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

                // Payments list
                Expanded(
                  child: state.filteredPayments.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                LucideIcons.creditCard,
                                size: 64.sp,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 16.h),
                              Text(
                                'لا توجد مدفوعات',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                'ابدأ بتسجيل دفعة جديدة',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Colors.grey[500],
                                ),
                              ),
                              SizedBox(height: 16.h),
                              ElevatedButton.icon(
                                onPressed: () => context.go('/payments/add'),
                                icon: const Icon(LucideIcons.plus),
                                label: const Text('تسجيل دفعة'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.symmetric(horizontal: 16.w),
                          itemCount: state.filteredPayments.length,
                          itemBuilder: (context, index) {
                            final paymentWithDetails = state.filteredPayments[index];
                            final payment = paymentWithDetails.payment;
                            final contract = paymentWithDetails.contract;

                            return AppCard(
                              onTap: () => context.go('/payments/edit/${payment.id}'),
                              child: Padding(
                                padding: EdgeInsets.all(16.w),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                contract.tenant.name,
                                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              SizedBox(height: 4.h),
                                              Text(
                                                contract.property.title,
                                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                                  color: Colors.grey[600],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.end,
                                          children: [
                                            Text(
                                              '${payment.amount.toStringAsFixed(0)} ${AppConstants.currency}',
                                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                                fontWeight: FontWeight.bold,
                                                color: const Color(AppConstants.primaryColor),
                                              ),
                                            ),
                                            SizedBox(height: 4.h),
                                            Container(
                                              padding: EdgeInsets.symmetric(
                                                horizontal: 8.w,
                                                vertical: 4.h,
                                              ),
                                              decoration: BoxDecoration(
                                                color: payment.isLate
                                                    ? const Color(AppConstants.errorColor).withOpacity(0.1)
                                                    : const Color(AppConstants.successColor).withOpacity(0.1),
                                                borderRadius: BorderRadius.circular(8.r),
                                              ),
                                              child: Text(
                                                payment.isLate ? 'متأخرة' : 'في الوقت',
                                                style: TextStyle(
                                                  color: payment.isLate
                                                      ? const Color(AppConstants.errorColor)
                                                      : const Color(AppConstants.successColor),
                                                  fontSize: 10.sp,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 12.h),
                                    
                                    Row(
                                      children: [
                                        Icon(
                                          LucideIcons.calendar,
                                          size: 16.sp,
                                          color: Colors.grey[600],
                                        ),
                                        SizedBox(width: 8.w),
                                        Text(
                                          'تاريخ الدفع: ${_formatDate(payment.paymentDate)}',
                                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 4.h),
                                    
                                    Row(
                                      children: [
                                        Icon(
                                          LucideIcons.calendarX,
                                          size: 16.sp,
                                          color: Colors.grey[600],
                                        ),
                                        SizedBox(width: 8.w),
                                        Text(
                                          'تاريخ الاستحقاق: ${_formatDate(payment.dueDate)}',
                                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                    
                                    if (payment.paymentMethod != null) ...[
                                      SizedBox(height: 4.h),
                                      Row(
                                        children: [
                                          Icon(
                                            LucideIcons.creditCard,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Text(
                                            'طريقة الدفع: ${payment.paymentMethod!}',
                                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    
                                    if (payment.referenceNumber != null) ...[
                                      SizedBox(height: 4.h),
                                      Row(
                                        children: [
                                          Icon(
                                            LucideIcons.hash,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Text(
                                            'رقم المرجع: ${payment.referenceNumber!}',
                                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    
                                    SizedBox(height: 12.h),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'هاتف: ${contract.tenant.phone}',
                                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            IconButton(
                                              onPressed: () => context.go('/payments/edit/${payment.id}'),
                                              icon: Icon(
                                                LucideIcons.edit,
                                                size: 20.sp,
                                                color: const Color(AppConstants.primaryColor),
                                              ),
                                            ),
                                            IconButton(
                                              onPressed: () => _showDeleteDialog(context, payment.id!),
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
        onPressed: () => context.go('/payments/add'),
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _showDeleteDialog(BuildContext context, int paymentId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('تأكيد الحذف'),
          content: const Text('هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<PaymentsBloc>().add(DeletePayment(paymentId));
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