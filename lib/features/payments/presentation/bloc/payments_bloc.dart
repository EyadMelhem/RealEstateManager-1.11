import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/payment.dart';

// Events
abstract class PaymentsEvent extends Equatable {
  const PaymentsEvent();

  @override
  List<Object?> get props => [];
}

class LoadPayments extends PaymentsEvent {}

class AddPayment extends PaymentsEvent {
  final Payment payment;

  const AddPayment(this.payment);

  @override
  List<Object> get props => [payment];
}

class UpdatePayment extends PaymentsEvent {
  final Payment payment;

  const UpdatePayment(this.payment);

  @override
  List<Object> get props => [payment];
}

class DeletePayment extends PaymentsEvent {
  final int paymentId;

  const DeletePayment(this.paymentId);

  @override
  List<Object> get props => [paymentId];
}

class FilterPayments extends PaymentsEvent {
  final DateTime? startDate;
  final DateTime? endDate;
  final String? paymentMethod;
  final bool? isLate;

  const FilterPayments({
    this.startDate,
    this.endDate,
    this.paymentMethod,
    this.isLate,
  });

  @override
  List<Object?> get props => [startDate, endDate, paymentMethod, isLate];
}

// States
abstract class PaymentsState extends Equatable {
  const PaymentsState();

  @override
  List<Object> get props => [];
}

class PaymentsInitial extends PaymentsState {}

class PaymentsLoading extends PaymentsState {}

class PaymentsLoaded extends PaymentsState {
  final List<PaymentWithDetails> payments;
  final List<PaymentWithDetails> filteredPayments;
  final List<PaymentWithDetails> overduePayments;
  final double totalAmount;
  final double monthlyTotal;

  const PaymentsLoaded({
    required this.payments,
    required this.filteredPayments,
    required this.overduePayments,
    required this.totalAmount,
    required this.monthlyTotal,
  });

  @override
  List<Object> get props => [
        payments,
        filteredPayments,
        overduePayments,
        totalAmount,
        monthlyTotal,
      ];
}

class PaymentsError extends PaymentsState {
  final String message;

  const PaymentsError(this.message);

  @override
  List<Object> get props => [message];
}

class PaymentOperationSuccess extends PaymentsState {
  final String message;

  const PaymentOperationSuccess(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class PaymentsBloc extends Bloc<PaymentsEvent, PaymentsState> {
  PaymentsBloc() : super(PaymentsInitial()) {
    on<LoadPayments>(_onLoadPayments);
    on<AddPayment>(_onAddPayment);
    on<UpdatePayment>(_onUpdatePayment);
    on<DeletePayment>(_onDeletePayment);
    on<FilterPayments>(_onFilterPayments);
  }

  Future<void> _onLoadPayments(
    LoadPayments event,
    Emitter<PaymentsState> emit,
  ) async {
    emit(PaymentsLoading());

    try {
      await Future.delayed(const Duration(milliseconds: 500));
      const payments = <PaymentWithDetails>[];

      final overduePayments = payments
          .where((p) => 
              p.payment.dueDate.isBefore(DateTime.now()) && 
              !p.payment.isLate)
          .toList();

      final totalAmount = payments.fold<double>(
        0.0,
        (sum, payment) => sum + payment.payment.amount,
      );

      final now = DateTime.now();
      final currentMonth = DateTime(now.year, now.month);
      final nextMonth = DateTime(now.year, now.month + 1);
      
      final monthlyTotal = payments
          .where((p) => 
              p.payment.paymentDate.isAfter(currentMonth) &&
              p.payment.paymentDate.isBefore(nextMonth))
          .fold<double>(0.0, (sum, payment) => sum + payment.payment.amount);

      emit(PaymentsLoaded(
        payments: payments,
        filteredPayments: payments,
        overduePayments: overduePayments,
        totalAmount: totalAmount,
        monthlyTotal: monthlyTotal,
      ));
    } catch (e) {
      emit(PaymentsError('فشل في تحميل المدفوعات: ${e.toString()}'));
    }
  }

  Future<void> _onAddPayment(
    AddPayment event,
    Emitter<PaymentsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(PaymentOperationSuccess('تم إضافة الدفعة بنجاح'));
      add(LoadPayments());
    } catch (e) {
      emit(PaymentsError('فشل في إضافة الدفعة: ${e.toString()}'));
    }
  }

  Future<void> _onUpdatePayment(
    UpdatePayment event,
    Emitter<PaymentsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(PaymentOperationSuccess('تم تحديث الدفعة بنجاح'));
      add(LoadPayments());
    } catch (e) {
      emit(PaymentsError('فشل في تحديث الدفعة: ${e.toString()}'));
    }
  }

  Future<void> _onDeletePayment(
    DeletePayment event,
    Emitter<PaymentsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(PaymentOperationSuccess('تم حذف الدفعة بنجاح'));
      add(LoadPayments());
    } catch (e) {
      emit(PaymentsError('فشل في حذف الدفعة: ${e.toString()}'));
    }
  }

  Future<void> _onFilterPayments(
    FilterPayments event,
    Emitter<PaymentsState> emit,
  ) async {
    if (state is PaymentsLoaded) {
      final currentState = state as PaymentsLoaded;
      var filteredPayments = currentState.payments;

      if (event.startDate != null) {
        filteredPayments = filteredPayments
            .where((p) => !p.payment.paymentDate.isBefore(event.startDate!))
            .toList();
      }

      if (event.endDate != null) {
        filteredPayments = filteredPayments
            .where((p) => !p.payment.paymentDate.isAfter(event.endDate!))
            .toList();
      }

      if (event.paymentMethod != null && event.paymentMethod!.isNotEmpty) {
        filteredPayments = filteredPayments
            .where((p) => p.payment.paymentMethod == event.paymentMethod)
            .toList();
      }

      if (event.isLate != null) {
        filteredPayments = filteredPayments
            .where((p) => p.payment.isLate == event.isLate)
            .toList();
      }

      emit(PaymentsLoaded(
        payments: currentState.payments,
        filteredPayments: filteredPayments,
        overduePayments: currentState.overduePayments,
        totalAmount: currentState.totalAmount,
        monthlyTotal: currentState.monthlyTotal,
      ));
    }
  }
}