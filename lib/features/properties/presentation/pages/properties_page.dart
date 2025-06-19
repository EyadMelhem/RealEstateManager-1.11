import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../bloc/properties_bloc.dart';

class PropertiesPage extends StatefulWidget {
  const PropertiesPage({super.key});

  @override
  State<PropertiesPage> createState() => _PropertiesPageState();
}

class _PropertiesPageState extends State<PropertiesPage> {
  final TextEditingController _searchController = TextEditingController();
  String? _selectedType;
  bool? _availabilityFilter;

  @override
  void initState() {
    super.initState();
    context.read<PropertiesBloc>().add(LoadProperties());
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
        title: const Text('إدارة العقارات'),
        actions: [
          IconButton(
            onPressed: () => context.go('/properties/add'),
            icon: const Icon(LucideIcons.plus),
          ),
        ],
      ),
      body: BlocConsumer<PropertiesBloc, PropertiesState>(
        listener: (context, state) {
          if (state is PropertyOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.successColor),
              ),
            );
            context.read<PropertiesBloc>().add(LoadProperties());
          } else if (state is PropertiesError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.errorColor),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is PropertiesLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is PropertiesError) {
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
                    'حدث خطأ في تحميل العقارات',
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
                      context.read<PropertiesBloc>().add(LoadProperties());
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is PropertiesLoaded) {
            return Column(
              children: [
                // Search and filters
                Container(
                  padding: EdgeInsets.all(16.w),
                  child: Column(
                    children: [
                      // Search bar
                      TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'البحث في العقارات...',
                          prefixIcon: const Icon(LucideIcons.search),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  onPressed: () {
                                    _searchController.clear();
                                    context.read<PropertiesBloc>().add(
                                          const SearchProperties(''),
                                        );
                                  },
                                  icon: const Icon(LucideIcons.x),
                                )
                              : null,
                        ),
                        onChanged: (value) {
                          context.read<PropertiesBloc>().add(
                                SearchProperties(value),
                              );
                        },
                      ),
                      SizedBox(height: 16.h),
                      
                      // Filters
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: _selectedType,
                              decoration: const InputDecoration(
                                labelText: 'نوع العقار',
                                prefixIcon: Icon(LucideIcons.building),
                              ),
                              items: [
                                const DropdownMenuItem<String>(
                                  value: null,
                                  child: Text('جميع الأنواع'),
                                ),
                                ...AppConstants.propertyTypes.map(
                                  (type) => DropdownMenuItem<String>(
                                    value: type,
                                    child: Text(type),
                                  ),
                                ),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _selectedType = value;
                                });
                                context.read<PropertiesBloc>().add(
                                      FilterProperties(type: value),
                                    );
                              },
                            ),
                          ),
                          SizedBox(width: 16.w),
                          Expanded(
                            child: DropdownButtonFormField<bool>(
                              value: _availabilityFilter,
                              decoration: const InputDecoration(
                                labelText: 'الحالة',
                                prefixIcon: Icon(LucideIcons.check),
                              ),
                              items: const [
                                DropdownMenuItem<bool>(
                                  value: null,
                                  child: Text('جميع العقارات'),
                                ),
                                DropdownMenuItem<bool>(
                                  value: true,
                                  child: Text('متاح'),
                                ),
                                DropdownMenuItem<bool>(
                                  value: false,
                                  child: Text('مؤجر'),
                                ),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _availabilityFilter = value;
                                });
                                context.read<PropertiesBloc>().add(
                                      FilterProperties(isAvailable: value),
                                    );
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Properties list
                Expanded(
                  child: state.filteredProperties.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                LucideIcons.building,
                                size: 64.sp,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 16.h),
                              Text(
                                'لا توجد عقارات',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 8.h),
                              Text(
                                'ابدأ بإضافة عقار جديد',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Colors.grey[500],
                                ),
                              ),
                              SizedBox(height: 16.h),
                              ElevatedButton.icon(
                                onPressed: () => context.go('/properties/add'),
                                icon: const Icon(LucideIcons.plus),
                                label: const Text('إضافة عقار'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.symmetric(horizontal: 16.w),
                          itemCount: state.filteredProperties.length,
                          itemBuilder: (context, index) {
                            final property = state.filteredProperties[index];
                            return AppCard(
                              onTap: () => context.go('/properties/edit/${property.id}'),
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
                                            color: property.isAvailable
                                                ? const Color(AppConstants.successColor).withOpacity(0.1)
                                                : const Color(AppConstants.warningColor).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(12.r),
                                          ),
                                          child: Text(
                                            property.isAvailable ? 'متاح' : 'مؤجر',
                                            style: TextStyle(
                                              color: property.isAvailable
                                                  ? const Color(AppConstants.successColor)
                                                  : const Color(AppConstants.warningColor),
                                              fontSize: 12.sp,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 8.h),
                                    
                                    Row(
                                      children: [
                                        Icon(
                                          LucideIcons.mapPin,
                                          size: 16.sp,
                                          color: Colors.grey[600],
                                        ),
                                        SizedBox(width: 8.w),
                                        Expanded(
                                          child: Text(
                                            property.address,
                                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 8.h),
                                    
                                    Row(
                                      children: [
                                        Icon(
                                          LucideIcons.home,
                                          size: 16.sp,
                                          color: Colors.grey[600],
                                        ),
                                        SizedBox(width: 8.w),
                                        Text(
                                          property.type,
                                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                        if (property.rooms != null) ...[
                                          SizedBox(width: 16.w),
                                          Icon(
                                            LucideIcons.door,
                                            size: 16.sp,
                                            color: Colors.grey[600],
                                          ),
                                          SizedBox(width: 8.w),
                                          Text(
                                            '${property.rooms} غرف',
                                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    SizedBox(height: 12.h),
                                    
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          '${property.monthlyRent.toStringAsFixed(0)} ${AppConstants.currency}/شهر',
                                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                            color: const Color(AppConstants.primaryColor),
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            IconButton(
                                              onPressed: () => context.go('/properties/edit/${property.id}'),
                                              icon: Icon(
                                                LucideIcons.edit,
                                                size: 20.sp,
                                                color: const Color(AppConstants.primaryColor),
                                              ),
                                            ),
                                            IconButton(
                                              onPressed: () => _showDeleteDialog(context, property.id!),
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
        onPressed: () => context.go('/properties/add'),
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, int propertyId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('تأكيد الحذف'),
          content: const Text('هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<PropertiesBloc>().add(DeleteProperty(propertyId));
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