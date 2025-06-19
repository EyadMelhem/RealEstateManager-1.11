import 'package:equatable/equatable.dart';
import '../../properties/domain/entities/property.dart';
import '../../tenants/domain/entities/tenant.dart';

class Contract extends Equatable {
  final int? id;
  final int propertyId;
  final int tenantId;
  final double monthlyRent;
  final DateTime startDate;
  final DateTime endDate;
  final double? securityDeposit;
  final String? notes;
  final bool isActive;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const Contract({
    this.id,
    required this.propertyId,
    required this.tenantId,
    required this.monthlyRent,
    required this.startDate,
    required this.endDate,
    this.securityDeposit,
    this.notes,
    this.isActive = true,
    required this.createdAt,
    this.updatedAt,
  });

  Contract copyWith({
    int? id,
    int? propertyId,
    int? tenantId,
    double? monthlyRent,
    DateTime? startDate,
    DateTime? endDate,
    double? securityDeposit,
    String? notes,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Contract(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      tenantId: tenantId ?? this.tenantId,
      monthlyRent: monthlyRent ?? this.monthlyRent,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      securityDeposit: securityDeposit ?? this.securityDeposit,
      notes: notes ?? this.notes,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        propertyId,
        tenantId,
        monthlyRent,
        startDate,
        endDate,
        securityDeposit,
        notes,
        isActive,
        createdAt,
        updatedAt,
      ];
}

class ContractWithDetails extends Equatable {
  final Contract contract;
  final Property property;
  final Tenant tenant;

  const ContractWithDetails({
    required this.contract,
    required this.property,
    required this.tenant,
  });

  @override
  List<Object> get props => [contract, property, tenant];
}