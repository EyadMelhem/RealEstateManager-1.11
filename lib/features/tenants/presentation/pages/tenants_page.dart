import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../bloc/tenants_bloc.dart';

class TenantsPage extends StatefulWidget {
  const TenantsPage({super.key});

  @override
  State<TenantsPage> createState() => _TenantsPageState();
}

class _TenantsPageState extends State<TenantsPage> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    context.read<TenantsBloc>().add(LoadTenants());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة المستأجرين'),
        actions: [
          IconButton(
            onPressed: () => context.go('/tenants/add'),
            icon: const Icon(LucideIcons.plus),
          ),
        ],
      ),
      body: BlocConsumer<TenantsBloc, TenantsState>(
        listener: (context, state) {
          if (state is TenantOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.successColor),
              ),
            );
            context.read<TenantsBloc>().add(LoadTenants());
          } else if (state is TenantsError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.errorColor),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is TenantsLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is TenantsError) {
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
                    'حدث خطأ في تحميل المستأجرين',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    state.message,
                    style: Theme.of(context).textTheme.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16.h),
                  ElevatedButton(
                    onPressed: () {
                      context.read<TenantsBloc>().add(LoadTenants());
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is TenantsLoaded) {
            return Column(
              children: [
                // Search bar
                Container(
                  padding: EdgeInsets.all(16.w),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'البحث في المستأجرين...',
                      prefixIcon: const Icon(LucideIcons.search),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              onPressed: () {
                                _searchController.clear();
                                context.read<TenantsBloc>().add(
                                      const SearchTenants(''),
                                    );
                              },
                              icon: const Icon(LucideIcons.x),
                            )
                          : null,
                    ),
                    onChanged: (value) {
                      context.read<TenantsBloc>().add(
                            SearchTenants(value),
                          );
                    },
                  ),
                ),

                // Tenants list
                Expanded(
                  child: state.filteredTenants.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                LucideIcons.users,
                                size: 64.sp,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 16.h),
                              Text(
                                'لا توجد مستأجرين',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                'ابدأ بإضافة مستأجر جديد',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Colors.grey[500],
                                ),
                              ),
                              SizedBox(height: 16.h),
                              ElevatedButton.icon(
                                onPressed: () => context.go('/tenants/add'),
                                icon: const Icon(LucideIcons.plus),
                                label: const Text('إضافة مستأجر'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.symmetric(horizontal: 16.w),
                          itemCount: state.filteredTenants.length,
                          itemBuilder: (context, index) {
                            final tenant = state.filteredTenants[index];
                            return AppCard(
                              onTap: () => context.go('/tenants/edit/${tenant.id}'),
                              child: Padding(
                                padding: EdgeInsets.all(16.w),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          backgroundColor: const Color(AppConstants.primaryColor).withOpacity(0.1),
                                          child: Icon(
                                            LucideIcons.user,
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
                                                tenant.name,
                                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              SizedBox(height: 4.h),
                                              Row(
                                                children: [
                                                  Icon(
                                                    LucideIcons.phone,
                                                    size: 16.sp,
                                                    color: Colors.grey[600],
                                                  ),
                                                  SizedBox(width: 8.w),
                                                  Text(
                                                    tenant.phone,
                                                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                                      color: Colors.grey[600],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                        PopupMenuButton<String>(
                                          onSelected: (value) {
                                            switch (value) {
                                              case 'edit':
                                                context.go('/tenants/edit/${tenant.id}');
                                                break;
                                              case 'delete':
                                                _showDeleteDialog(context, tenant.id!);
                                                break;
                                            }
                                          },
                                          itemBuilder: (context) => [
                                            const PopupMenuItem(
                                              value: 'edit',
                                              child: Row(
                                                children: [
                                                  Icon(LucideIcons.edit),
                                                  SizedBox(width: 8),
                                                  Text('تعديل'),
                                                ],
                                              ),
                                            ),
                                            const PopupMenuItem(
                                              value: 'delete',
                                              child: Row(
                                                children: [
                                                  Icon(LucideIcons.trash2, color: Colors.red),
                                                  SizedBox(width: 8),
                                                  Text('حذف', style: TextStyle(color: Colors.red)),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    
                                    if (tenant.email != null) ...[
                                      SizedBox(height: 12.h),
                                      Row(
                                        children: [
                                          Icon(
                                            LucideIcons.mail,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Expanded(
                                            child: Text(
                                              tenant.email!,
                                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    
                                    if (tenant.occupation != null) ...[
                                      SizedBox(height: 8.h),
                                      Row(
                                        children: [
                                          Icon(
                                            LucideIcons.briefcase,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Expanded(
                                            child: Text(
                                              tenant.occupation!,
                                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    
                                    if (tenant.nationalId != null) ...[
                                      SizedBox(height: 8.h),
                                      Row(
                                        children: [
                                          Icon(
                                            LucideIcons.creditCard,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Text(
                                            'الرقم الوطني: ${tenant.nationalId!}',
                                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    
                                    if (tenant.emergencyContact != null) ...[
                                      SizedBox(height: 12.h),
                                      Container(
                                        padding: EdgeInsets.all(12.w),
                                        decoration: BoxDecoration(
                                          color: Colors.grey[50],
                                          borderRadius: BorderRadius.circular(8.r),
                                        ),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'جهة الاتصال الطارئ',
                                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                                fontWeight: FontWeight.w600,
                                                color: Colors.grey[700],
                                              ),
                                            ),
                                            SizedBox(height: 4.h),
                                            Text(
                                              tenant.emergencyContact!,
                                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                            if (tenant.emergencyPhone != null) ...[
                                              SizedBox(height: 2.h),
                                              Text(
                                                tenant.emergencyPhone!,
                                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                                  color: Colors.grey[600],
                                                ),
                                              ),
                                            ],
                                          ],
                                        ),
                                      ),
                                    ],
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
        onPressed: () => context.go('/tenants/add'),
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, int tenantId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('تأكيد الحذف'),
          content: const Text('هل أنت متأكد من حذف هذا المستأجر؟ لا يمكن التراجع عن هذا الإجراء.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<TenantsBloc>().add(DeleteTenant(tenantId));
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