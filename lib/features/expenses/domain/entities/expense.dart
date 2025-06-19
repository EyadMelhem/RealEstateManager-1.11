import 'package:equatable/equatable.dart';
import '../../properties/domain/entities/property.dart';
import '../../contracts/domain/entities/contract.dart';

class Expense extends Equatable {
  final int? id;
  final int propertyId;
  final int? contractId;
  final String category;
  final String description;
  final double amount;
  final DateTime expenseDate;
  final String? vendor;
  final String? receiptNumber;
  final String? notes;
  final bool isRecurring;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const Expense({
    this.id,
    required this.propertyId,
    this.contractId,
    required this.category,
    required this.description,
    required this.amount,
    required this.expenseDate,
    this.vendor,
    this.receiptNumber,
    this.notes,
    this.isRecurring = false,
    required this.createdAt,
    this.updatedAt,
  });

  Expense copyWith({
    int? id,
    int? propertyId,
    int? contractId,
    String? category,
    String? description,
    double? amount,
    DateTime? expenseDate,
    String? vendor,
    String? receiptNumber,
    String? notes,
    bool? isRecurring,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Expense(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      contractId: contractId ?? this.contractId,
      category: category ?? this.category,
      description: description ?? this.description,
      amount: amount ?? this.amount,
      expenseDate: expenseDate ?? this.expenseDate,
      vendor: vendor ?? this.vendor,
      receiptNumber: receiptNumber ?? this.receiptNumber,
      notes: notes ?? this.notes,
      isRecurring: isRecurring ?? this.isRecurring,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        propertyId,
        contractId,
        category,
        description,
        amount,
        expenseDate,
        vendor,
        receiptNumber,
        notes,
        isRecurring,
        createdAt,
        updatedAt,
      ];
}

class ExpenseWithDetails extends Equatable {
  final Expense expense;
  final Property property;
  final ContractWithDetails? contract;

  const ExpenseWithDetails({
    required this.expense,
    required this.property,
    this.contract,
  });

  @override
  List<Object?> get props => [expense, property, contract];
}