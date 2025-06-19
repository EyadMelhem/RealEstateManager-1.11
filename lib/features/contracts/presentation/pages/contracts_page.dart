import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../bloc/contracts_bloc.dart';

class ContractsPage extends StatefulWidget {
  const ContractsPage({super.key});

  @override
  State<ContractsPage> createState() => _ContractsPageState();
}

class _ContractsPageState extends State<ContractsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    context.read<ContractsBloc>().add(LoadContracts());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة العقود'),
        actions: [
          IconButton(
            onPressed: () => context.go('/contracts/add'),
            icon: const Icon(LucideIcons.plus),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'جميع العقود'),
            Tab(text: 'نشطة'),
            Tab(text: 'منتهية'),
          ],
        ),
      ),
      body: BlocConsumer<ContractsBloc, ContractsState>(
        listener: (context, state) {
          if (state is ContractOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.successColor),
              ),
            );
          } else if (state is ContractsError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.errorColor),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is ContractsLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is ContractsError) {
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
                    'حدث خطأ في تحميل العقود',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 16.h),
                  ElevatedButton(
                    onPressed: () {
                      context.read<ContractsBloc>().add(LoadContracts());
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is ContractsLoaded) {
            return TabBarView(
              controller: _tabController,
              children: [
                _buildContractsList(state.contracts),
                _buildContractsList(state.activeContracts),
                _buildContractsList(state.expiredContracts),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/contracts/add'),
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Widget _buildContractsList(contracts) {
    if (contracts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              LucideIcons.fileText,
              size: 64.sp,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16.h),
            Text(
              'لا توجد عقود',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8.h),
            Text(
              'ابدأ بإنشاء عقد جديد',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.grey[500],
              ),
            ),
            SizedBox(height: 16.h),
            ElevatedButton.icon(
              onPressed: () => context.go('/contracts/add'),
              icon: const Icon(LucideIcons.plus),
              label: const Text('إنشاء عقد'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(16.w),
      itemCount: contracts.length,
      itemBuilder: (context, index) {
        final contractWithDetails = contracts[index];
        final contract = contractWithDetails.contract;
        final property = contractWithDetails.property;
        final tenant = contractWithDetails.tenant;

        return AppCard(
          onTap: () => context.go('/contracts/edit/${contract.id}'),
          child: Padding(
            padding: EdgeInsets.all(16.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        property.title,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 12.w,
                        vertical: 4.h,
                      ),
                      decoration: BoxDecoration(
                        color: contract.isActive
                            ? const Color(AppConstants.successColor).withOpacity(0.1)
                            : const Color(AppConstants.errorColor).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                      child: Text(
                        contract.isActive ? 'نشط' : 'منتهي',
                        style: TextStyle(
                          color: contract.isActive
                              ? const Color(AppConstants.successColor)
                              : const Color(AppConstants.errorColor),
                          fontSize: 12.sp,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12.h),
                
                Row(
                  children: [
                    Icon(
                      LucideIcons.user,
                      size: 16.sp,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 8.w),
                    Text(
                      'المستأجر: ${tenant.name}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8.h),
                
                Row(
                  children: [
                    Icon(
                      LucideIcons.calendar,
                      size: 16.sp,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 8.w),
                    Text(
                      'من ${_formatDate(contract.startDate)} إلى ${_formatDate(contract.endDate)}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8.h),
                
                Row(
                  children: [
                    Icon(
                      LucideIcons.dollarSign,
                      size: 16.sp,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 8.w),
                    Text(
                      'الإيجار: ${contract.monthlyRent.toStringAsFixed(0)} ${AppConstants.currency}/شهر',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: const Color(AppConstants.primaryColor),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                
                if (contract.securityDeposit != null) ...[
                  SizedBox(height: 8.h),
                  Row(
                    children: [
                      Icon(
                        LucideIcons.shield,
                        size: 16.sp,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 8.w),
                      Text(
                        'التأمين: ${contract.securityDeposit!.toStringAsFixed(0)} ${AppConstants.currency}',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
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
                      'هاتف المستأجر: ${tenant.phone}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => context.go('/contracts/edit/${contract.id}'),
                          icon: Icon(
                            LucideIcons.edit,
                            size: 20.sp,
                            color: const Color(AppConstants.primaryColor),
                          ),
                        ),
                        IconButton(
                          onPressed: () => _showDeleteDialog(context, contract.id!),
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
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _showDeleteDialog(BuildContext context, int contractId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('تأكيد الحذف'),
          content: const Text('هل أنت متأكد من حذف هذا العقد؟ لا يمكن التراجع عن هذا الإجراء.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<ContractsBloc>().add(DeleteContract(contractId));
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