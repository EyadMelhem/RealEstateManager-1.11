import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/stat_card.dart';
import '../bloc/dashboard_bloc.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  void initState() {
    super.initState();
    context.read<DashboardBloc>().add(LoadDashboardData());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('لوحة التحكم'),
        elevation: 0,
      ),
      body: BlocBuilder<DashboardBloc, DashboardState>(
        builder: (context, state) {
          if (state is DashboardLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is DashboardError) {
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
                    'حدث خطأ في تحميل البيانات',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    state.message,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  SizedBox(height: 16.h),
                  ElevatedButton(
                    onPressed: () {
                      context.read<DashboardBloc>().add(LoadDashboardData());
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is DashboardLoaded) {
            return RefreshIndicator(
              onRefresh: () async {
                context.read<DashboardBloc>().add(LoadDashboardData());
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: EdgeInsets.all(16.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome section
                    AppCard(
                      child: Padding(
                        padding: EdgeInsets.all(20.w),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'أهلاً وسهلاً',
                                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                      color: const Color(AppConstants.primaryColor),
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 8.h),
                                  Text(
                                    'نظام إدارة العقارات الشامل',
                                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Icon(
                              LucideIcons.building,
                              size: 48.sp,
                              color: const Color(AppConstants.primaryColor),
                            ),
                          ],
                        ),
                      ),
                    ),

                    SizedBox(height: 24.h),

                    // Statistics cards
                    Text(
                      'الإحصائيات',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 16.h),

                    GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16.w,
                      mainAxisSpacing: 16.h,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      childAspectRatio: 1.2,
                      children: [
                        StatCard(
                          title: 'إجمالي العقارات',
                          value: state.stats.totalProperties.toString(),
                          icon: LucideIcons.building,
                          color: const Color(AppConstants.primaryColor),
                          onTap: () => context.go('/properties'),
                        ),
                        StatCard(
                          title: 'المستأجرين النشطين',
                          value: state.stats.activeTenants.toString(),
                          icon: LucideIcons.users,
                          color: const Color(AppConstants.successColor),
                          onTap: () => context.go('/tenants'),
                        ),
                        StatCard(
                          title: 'الإيراد الشهري',
                          value: '${state.stats.monthlyRevenue.toStringAsFixed(0)} ${AppConstants.currency}',
                          icon: LucideIcons.dollarSign,
                          color: const Color(AppConstants.warningColor),
                          onTap: () => context.go('/payments'),
                        ),
                        StatCard(
                          title: 'الدفعات المتأخرة',
                          value: state.stats.overduePayments.toString(),
                          icon: LucideIcons.alertTriangle,
                          color: const Color(AppConstants.errorColor),
                          onTap: () => context.go('/payments'),
                        ),
                      ],
                    ),

                    SizedBox(height: 32.h),

                    // Quick actions
                    Text(
                      'الإجراءات السريعة',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 16.h),

                    AppCard(
                      child: Padding(
                        padding: EdgeInsets.all(16.w),
                        child: Column(
                          children: [
                            _buildQuickAction(
                              context,
                              'إضافة عقار جديد',
                              'أضف عقاراً جديداً إلى النظام',
                              LucideIcons.plus,
                              () => context.go('/properties/add'),
                            ),
                            Divider(height: 24.h),
                            _buildQuickAction(
                              context,
                              'إضافة مستأجر جديد',
                              'سجل مستأجراً جديداً',
                              LucideIcons.userPlus,
                              () => context.go('/tenants/add'),
                            ),
                            Divider(height: 24.h),
                            _buildQuickAction(
                              context,
                              'إنشاء عقد جديد',
                              'أنشئ عقد إيجار جديد',
                              LucideIcons.fileText,
                              () => context.go('/contracts/add'),
                            ),
                            Divider(height: 24.h),
                            _buildQuickAction(
                              context,
                              'تسجيل دفعة',
                              'سجل دفعة جديدة',
                              LucideIcons.creditCard,
                              () => context.go('/payments/add'),
                            ),
                          ],
                        ),
                      ),
                    ),

                    SizedBox(height: 32.h),

                    // Recent activity
                    if (state.recentPayments.isNotEmpty) ...[
                      Text(
                        'أحدث المدفوعات',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16.h),
                      AppCard(
                        child: Column(
                          children: state.recentPayments.take(5).map((payment) {
                            return ListTile(
                              leading: CircleAvatar(
                                backgroundColor: const Color(AppConstants.primaryColor).withOpacity(0.1),
                                child: Icon(
                                  LucideIcons.creditCard,
                                  color: const Color(AppConstants.primaryColor),
                                  size: 20.sp,
                                ),
                              ),
                              title: Text(
                                payment.contract.tenant.name,
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                              subtitle: Text(
                                '${payment.contract.property.title} - ${payment.amount.toStringAsFixed(0)} ${AppConstants.currency}',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                              trailing: Text(
                                _formatDate(payment.paymentDate),
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],

                    SizedBox(height: 32.h),
                  ],
                ),
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildQuickAction(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.r),
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: 8.h),
        child: Row(
          children: [
            Container(
              width: 48.w,
              height: 48.h,
              decoration: BoxDecoration(
                color: const Color(AppConstants.primaryColor).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: Icon(
                icon,
                color: const Color(AppConstants.primaryColor),
                size: 24.sp,
              ),
            ),
            SizedBox(width: 16.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              LucideIcons.chevronLeft,
              color: Colors.grey[400],
              size: 20.sp,
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}