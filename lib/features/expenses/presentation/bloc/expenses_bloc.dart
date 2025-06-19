import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/expense.dart';

// Events
abstract class ExpensesEvent extends Equatable {
  const ExpensesEvent();

  @override
  List<Object?> get props => [];
}

class LoadExpenses extends ExpensesEvent {}

class AddExpense extends ExpensesEvent {
  final Expense expense;

  const AddExpense(this.expense);

  @override
  List<Object> get props => [expense];
}

class UpdateExpense extends ExpensesEvent {
  final Expense expense;

  const UpdateExpense(this.expense);

  @override
  List<Object> get props => [expense];
}

class DeleteExpense extends ExpensesEvent {
  final int expenseId;

  const DeleteExpense(this.expenseId);

  @override
  List<Object> get props => [expenseId];
}

class FilterExpensesByCategory extends ExpensesEvent {
  final String? category;

  const FilterExpensesByCategory(this.category);

  @override
  List<Object?> get props => [category];
}

class FilterExpensesByProperty extends ExpensesEvent {
  final int? propertyId;

  const FilterExpensesByProperty(this.propertyId);

  @override
  List<Object?> get props => [propertyId];
}

// States
abstract class ExpensesState extends Equatable {
  const ExpensesState();

  @override
  List<Object> get props => [];
}

class ExpensesInitial extends ExpensesState {}

class ExpensesLoading extends ExpensesState {}

class ExpensesLoaded extends ExpensesState {
  final List<ExpenseWithDetails> expenses;
  final List<ExpenseWithDetails> filteredExpenses;
  final Map<String, double> categoryTotals;
  final double totalAmount;
  final double monthlyTotal;
  final String? selectedCategory;
  final int? selectedPropertyId;

  const ExpensesLoaded({
    required this.expenses,
    required this.filteredExpenses,
    required this.categoryTotals,
    required this.totalAmount,
    required this.monthlyTotal,
    this.selectedCategory,
    this.selectedPropertyId,
  });

  @override
  List<Object?> get props => [
        expenses,
        filteredExpenses,
        categoryTotals,
        totalAmount,
        monthlyTotal,
        selectedCategory,
        selectedPropertyId,
      ];

  ExpensesLoaded copyWith({
    List<ExpenseWithDetails>? expenses,
    List<ExpenseWithDetails>? filteredExpenses,
    Map<String, double>? categoryTotals,
    double? totalAmount,
    double? monthlyTotal,
    String? selectedCategory,
    int? selectedPropertyId,
  }) {
    return ExpensesLoaded(
      expenses: expenses ?? this.expenses,
      filteredExpenses: filteredExpenses ?? this.filteredExpenses,
      categoryTotals: categoryTotals ?? this.categoryTotals,
      totalAmount: totalAmount ?? this.totalAmount,
      monthlyTotal: monthlyTotal ?? this.monthlyTotal,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      selectedPropertyId: selectedPropertyId ?? this.selectedPropertyId,
    );
  }
}

class ExpensesError extends ExpensesState {
  final String message;

  const ExpensesError(this.message);

  @override
  List<Object> get props => [message];
}

class ExpenseOperationSuccess extends ExpensesState {
  final String message;

  const ExpenseOperationSuccess(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class ExpensesBloc extends Bloc<ExpensesEvent, ExpensesState> {
  ExpensesBloc() : super(ExpensesInitial()) {
    on<LoadExpenses>(_onLoadExpenses);
    on<AddExpense>(_onAddExpense);
    on<UpdateExpense>(_onUpdateExpense);
    on<DeleteExpense>(_onDeleteExpense);
    on<FilterExpensesByCategory>(_onFilterExpensesByCategory);
    on<FilterExpensesByProperty>(_onFilterExpensesByProperty);
  }

  Future<void> _onLoadExpenses(
    LoadExpenses event,
    Emitter<ExpensesState> emit,
  ) async {
    emit(ExpensesLoading());

    try {
      await Future.delayed(const Duration(milliseconds: 500));
      const expenses = <ExpenseWithDetails>[];

      final categoryTotals = <String, double>{};
      double totalAmount = 0.0;

      for (final expense in expenses) {
        final category = expense.expense.category;
        categoryTotals[category] = (categoryTotals[category] ?? 0.0) + expense.expense.amount;
        totalAmount += expense.expense.amount;
      }

      final now = DateTime.now();
      final currentMonth = DateTime(now.year, now.month);
      final nextMonth = DateTime(now.year, now.month + 1);
      
      final monthlyTotal = expenses
          .where((e) => 
              e.expense.expenseDate.isAfter(currentMonth) &&
              e.expense.expenseDate.isBefore(nextMonth))
          .fold<double>(0.0, (sum, expense) => sum + expense.expense.amount);

      emit(ExpensesLoaded(
        expenses: expenses,
        filteredExpenses: expenses,
        categoryTotals: categoryTotals,
        totalAmount: totalAmount,
        monthlyTotal: monthlyTotal,
      ));
    } catch (e) {
      emit(ExpensesError('فشل في تحميل المصاريف: ${e.toString()}'));
    }
  }

  Future<void> _onAddExpense(
    AddExpense event,
    Emitter<ExpensesState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ExpenseOperationSuccess('تم إضافة المصروف بنجاح'));
      add(LoadExpenses());
    } catch (e) {
      emit(ExpensesError('فشل في إضافة المصروف: ${e.toString()}'));
    }
  }

  Future<void> _onUpdateExpense(
    UpdateExpense event,
    Emitter<ExpensesState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ExpenseOperationSuccess('تم تحديث المصروف بنجاح'));
      add(LoadExpenses());
    } catch (e) {
      emit(ExpensesError('فشل في تحديث المصروف: ${e.toString()}'));
    }
  }

  Future<void> _onDeleteExpense(
    DeleteExpense event,
    Emitter<ExpensesState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ExpenseOperationSuccess('تم حذف المصروف بنجاح'));
      add(LoadExpenses());
    } catch (e) {
      emit(ExpensesError('فشل في حذف المصروف: ${e.toString()}'));
    }
  }

  Future<void> _onFilterExpensesByCategory(
    FilterExpensesByCategory event,
    Emitter<ExpensesState> emit,
  ) async {
    if (state is ExpensesLoaded) {
      final currentState = state as ExpensesLoaded;
      
      List<ExpenseWithDetails> filteredExpenses;
      if (event.category == null || event.category!.isEmpty) {
        filteredExpenses = currentState.expenses;
      } else {
        filteredExpenses = currentState.expenses
            .where((e) => e.expense.category == event.category)
            .toList();
      }

      emit(currentState.copyWith(
        filteredExpenses: filteredExpenses,
        selectedCategory: event.category,
        selectedPropertyId: null,
      ));
    }
  }

  Future<void> _onFilterExpensesByProperty(
    FilterExpensesByProperty event,
    Emitter<ExpensesState> emit,
  ) async {
    if (state is ExpensesLoaded) {
      final currentState = state as ExpensesLoaded;
      
      List<ExpenseWithDetails> filteredExpenses;
      if (event.propertyId == null) {
        filteredExpenses = currentState.expenses;
      } else {
        filteredExpenses = currentState.expenses
            .where((e) => e.expense.propertyId == event.propertyId)
            .toList();
      }

      emit(currentState.copyWith(
        filteredExpenses: filteredExpenses,
        selectedPropertyId: event.propertyId,
        selectedCategory: null,
      ));
    }
  }
}