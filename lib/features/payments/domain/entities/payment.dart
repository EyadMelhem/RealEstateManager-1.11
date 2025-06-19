import 'package:equatable/equatable.dart';
import '../../contracts/domain/entities/contract.dart';

class Payment extends Equatable {
  final int? id;
  final int contractId;
  final double amount;
  final DateTime paymentDate;
  final DateTime dueDate;
  final String? paymentMethod;
  final String? referenceNumber;
  final String? notes;
  final bool isLate;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const Payment({
    this.id,
    required this.contractId,
    required this.amount,
    required this.paymentDate,
    required this.dueDate,
    this.paymentMethod,
    this.referenceNumber,
    this.notes,
    this.isLate = false,
    required this.createdAt,
    this.updatedAt,
  });

  Payment copyWith({
    int? id,
    int? contractId,
    double? amount,
    DateTime? paymentDate,
    DateTime? dueDate,
    String? paymentMethod,
    String? referenceNumber,
    String? notes,
    bool? isLate,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Payment(
      id: id ?? this.id,
      contractId: contractId ?? this.contractId,
      amount: amount ?? this.amount,
      paymentDate: paymentDate ?? this.paymentDate,
      dueDate: dueDate ?? this.dueDate,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      referenceNumber: referenceNumber ?? this.referenceNumber,
      notes: notes ?? this.notes,
      isLate: isLate ?? this.isLate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        contractId,
        amount,
        paymentDate,
        dueDate,
        paymentMethod,
        referenceNumber,
        notes,
        isLate,
        createdAt,
        updatedAt,
      ];
}

class PaymentWithDetails extends Equatable {
  final Payment payment;
  final ContractWithDetails contract;

  const PaymentWithDetails({
    required this.payment,
    required this.contract,
  });

  @override
  List<Object> get props => [payment, contract];
}