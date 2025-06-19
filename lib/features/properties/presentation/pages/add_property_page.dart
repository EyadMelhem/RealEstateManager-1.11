import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../domain/entities/property.dart';
import '../bloc/properties_bloc.dart';

class AddPropertyPage extends StatefulWidget {
  final int? propertyId;

  const AddPropertyPage({super.key, this.propertyId});

  @override
  State<AddPropertyPage> createState() => _AddPropertyPageState();
}

class _AddPropertyPageState extends State<AddPropertyPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _addressController = TextEditingController();
  final _roomsController = TextEditingController();
  final _areaController = TextEditingController();
  final _monthlyRentController = TextEditingController();
  final _ownerNameController = TextEditingController();
  final _ownerPhoneController = TextEditingController();
  final _ownerEmailController = TextEditingController();
  final _descriptionController = TextEditingController();

  String _selectedType = AppConstants.propertyTypes.first;
  bool _isAvailable = true;

  bool get isEditing => widget.propertyId != null;

  @override
  void initState() {
    super.initState();
    if (isEditing) {
      // Load property data for editing
      _loadPropertyData();
    }
  }

  void _loadPropertyData() {
    // TODO: Load property data from database
    // This is a placeholder - in a real app, you'd fetch the property by ID
  }

  @override
  void dispose() {
    _titleController.dispose();
    _addressController.dispose();
    _roomsController.dispose();
    _areaController.dispose();
    _monthlyRentController.dispose();
    _ownerNameController.dispose();
    _ownerPhoneController.dispose();
    _ownerEmailController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'تعديل العقار' : 'إضافة عقار جديد'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(LucideIcons.arrowRight),
        ),
      ),
      body: BlocListener<PropertiesBloc, PropertiesState>(
        listener: (context, state) {
          if (state is PropertyOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.successColor),
              ),
            );
            context.pop();
          } else if (state is PropertiesError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(AppConstants.errorColor),
              ),
            );
          }
        },
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.w),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppCard(
                  padding: EdgeInsets.all(20.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'معلومات العقار الأساسية',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 20.h),

                      // Title
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'عنوان العقار *',
                          prefixIcon: Icon(LucideIcons.home),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'مطلوب إدخال عنوان العقار';
                          }
                          return null;
                        },
                      ),
                      SizedBox(height: 16.h),

                      // Address
                      TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          labelText: 'العنوان *',
                          prefixIcon: Icon(LucideIcons.mapPin),
                        ),
                        maxLines: 2,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'مطلوب إدخال العنوان';
                          }
                          return null;
                        },
                      ),
                      SizedBox(height: 16.h),

                      // Property type
                      DropdownButtonFormField<String>(
                        value: _selectedType,
                        decoration: const InputDecoration(
                          labelText: 'نوع العقار *',
                          prefixIcon: Icon(LucideIcons.building),
                        ),
                        items: AppConstants.propertyTypes.map((type) {
                          return DropdownMenuItem<String>(
                            value: type,
                            child: Text(type),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedType = value!;
                          });
                        },
                      ),
                      SizedBox(height: 16.h),

                      // Rooms and Area
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _roomsController,
                              decoration: const InputDecoration(
                                labelText: 'عدد الغرف',
                                prefixIcon: Icon(LucideIcons.door),
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                          SizedBox(width: 16.w),
                          Expanded(
                            child: TextFormField(
                              controller: _areaController,
                              decoration: const InputDecoration(
                                labelText: 'المساحة (م²)',
                                prefixIcon: Icon(LucideIcons.square),
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16.h),

                      // Monthly rent
                      TextFormField(
                        controller: _monthlyRentController,
                        decoration: InputDecoration(
                          labelText: 'الإيجار الشهري (${AppConstants.currency}) *',
                          prefixIcon: const Icon(LucideIcons.dollarSign),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'مطلوب إدخال الإيجار الشهري';
                          }
                          if (double.tryParse(value) == null) {
                            return 'يجب إدخال رقم صحيح';
                          }
                          return null;
                        },
                      ),
                      SizedBox(height: 16.h),

                      // Availability switch
                      SwitchListTile(
                        title: const Text('العقار متاح للإيجار'),
                        subtitle: Text(_isAvailable ? 'متاح' : 'مؤجر'),
                        value: _isAvailable,
                        onChanged: (value) {
                          setState(() {
                            _isAvailable = value;
                          });
                        },
                        activeColor: const Color(AppConstants.successColor),
                      ),
                    ],
                  ),
                ),

                SizedBox(height: 24.h),

                AppCard(
                  padding: EdgeInsets.all(20.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'معلومات المالك',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 20.h),

                      // Owner name
                      TextFormField(
                        controller: _ownerNameController,
                        decoration: const InputDecoration(
                          labelText: 'اسم المالك *',
                          prefixIcon: Icon(LucideIcons.user),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'مطلوب إدخال اسم المالك';
                          }
                          return null;
                        },
                      ),
                      SizedBox(height: 16.h),

                      // Owner phone
                      TextFormField(
                        controller: _ownerPhoneController,
                        decoration: const InputDecoration(
                          labelText: 'هاتف المالك',
                          prefixIcon: Icon(LucideIcons.phone),
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                      SizedBox(height: 16.h),

                      // Owner email
                      TextFormField(
                        controller: _ownerEmailController,
                        decoration: const InputDecoration(
                          labelText: 'بريد المالك الإلكتروني',
                          prefixIcon: Icon(LucideIcons.mail),
                        ),
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                            if (!emailRegex.hasMatch(value)) {
                              return 'البريد الإلكتروني غير صحيح';
                            }
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),

                SizedBox(height: 24.h),

                AppCard(
                  padding: EdgeInsets.all(20.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'وصف إضافي',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 20.h),

                      // Description
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(
                          labelText: 'وصف العقار',
                          prefixIcon: Icon(LucideIcons.fileText),
                          hintText: 'أضف وصفاً تفصيلياً للعقار...',
                        ),
                        maxLines: 4,
                      ),
                    ],
                  ),
                ),

                SizedBox(height: 32.h),

                // Submit button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _submitForm,
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 16.h),
                    ),
                    child: Text(
                      isEditing ? 'تحديث العقار' : 'إضافة العقار',
                      style: TextStyle(fontSize: 16.sp),
                    ),
                  ),
                ),

                SizedBox(height: 32.h),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final property = Property(
        id: isEditing ? widget.propertyId : null,
        title: _titleController.text.trim(),
        address: _addressController.text.trim(),
        type: _selectedType,
        rooms: _roomsController.text.isEmpty ? null : int.tryParse(_roomsController.text),
        area: _areaController.text.trim().isEmpty ? null : _areaController.text.trim(),
        monthlyRent: double.parse(_monthlyRentController.text),
        ownerName: _ownerNameController.text.trim(),
        ownerPhone: _ownerPhoneController.text.trim().isEmpty ? null : _ownerPhoneController.text.trim(),
        ownerEmail: _ownerEmailController.text.trim().isEmpty ? null : _ownerEmailController.text.trim(),
        description: _descriptionController.text.trim().isEmpty ? null : _descriptionController.text.trim(),
        isAvailable: _isAvailable,
        createdAt: DateTime.now(),
        updatedAt: isEditing ? DateTime.now() : null,
      );

      if (isEditing) {
        context.read<PropertiesBloc>().add(UpdateProperty(property));
      } else {
        context.read<PropertiesBloc>().add(AddProperty(property));
      }
    }
  }
}