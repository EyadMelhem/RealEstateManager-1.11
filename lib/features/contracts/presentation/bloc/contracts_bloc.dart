import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/contract.dart';

// Events
abstract class ContractsEvent extends Equatable {
  const ContractsEvent();

  @override
  List<Object?> get props => [];
}

class LoadContracts extends ContractsEvent {}

class AddContract extends ContractsEvent {
  final Contract contract;

  const AddContract(this.contract);

  @override
  List<Object> get props => [contract];
}

class UpdateContract extends ContractsEvent {
  final Contract contract;

  const UpdateContract(this.contract);

  @override
  List<Object> get props => [contract];
}

class DeleteContract extends ContractsEvent {
  final int contractId;

  const DeleteContract(this.contractId);

  @override
  List<Object> get props => [contractId];
}

class ToggleContractStatus extends ContractsEvent {
  final int contractId;

  const ToggleContractStatus(this.contractId);

  @override
  List<Object> get props => [contractId];
}

// States
abstract class ContractsState extends Equatable {
  const ContractsState();

  @override
  List<Object> get props => [];
}

class ContractsInitial extends ContractsState {}

class ContractsLoading extends ContractsState {}

class ContractsLoaded extends ContractsState {
  final List<ContractWithDetails> contracts;
  final List<ContractWithDetails> activeContracts;
  final List<ContractWithDetails> expiredContracts;

  const ContractsLoaded({
    required this.contracts,
    required this.activeContracts,
    required this.expiredContracts,
  });

  @override
  List<Object> get props => [contracts, activeContracts, expiredContracts];
}

class ContractsError extends ContractsState {
  final String message;

  const ContractsError(this.message);

  @override
  List<Object> get props => [message];
}

class ContractOperationSuccess extends ContractsState {
  final String message;

  const ContractOperationSuccess(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class ContractsBloc extends Bloc<ContractsEvent, ContractsState> {
  ContractsBloc() : super(ContractsInitial()) {
    on<LoadContracts>(_onLoadContracts);
    on<AddContract>(_onAddContract);
    on<UpdateContract>(_onUpdateContract);
    on<DeleteContract>(_onDeleteContract);
    on<ToggleContractStatus>(_onToggleContractStatus);
  }

  Future<void> _onLoadContracts(
    LoadContracts event,
    Emitter<ContractsState> emit,
  ) async {
    emit(ContractsLoading());

    try {
      await Future.delayed(const Duration(milliseconds: 500));
      const contracts = <ContractWithDetails>[];

      final activeContracts = contracts.where((c) => c.contract.isActive).toList();
      final expiredContracts = contracts.where((c) => !c.contract.isActive).toList();

      emit(ContractsLoaded(
        contracts: contracts,
        activeContracts: activeContracts,
        expiredContracts: expiredContracts,
      ));
    } catch (e) {
      emit(ContractsError('فشل في تحميل العقود: ${e.toString()}'));
    }
  }

  Future<void> _onAddContract(
    AddContract event,
    Emitter<ContractsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ContractOperationSuccess('تم إضافة العقد بنجاح'));
      add(LoadContracts());
    } catch (e) {
      emit(ContractsError('فشل في إضافة العقد: ${e.toString()}'));
    }
  }

  Future<void> _onUpdateContract(
    UpdateContract event,
    Emitter<ContractsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ContractOperationSuccess('تم تحديث العقد بنجاح'));
      add(LoadContracts());
    } catch (e) {
      emit(ContractsError('فشل في تحديث العقد: ${e.toString()}'));
    }
  }

  Future<void> _onDeleteContract(
    DeleteContract event,
    Emitter<ContractsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ContractOperationSuccess('تم حذف العقد بنجاح'));
      add(LoadContracts());
    } catch (e) {
      emit(ContractsError('فشل في حذف العقد: ${e.toString()}'));
    }
  }

  Future<void> _onToggleContractStatus(
    ToggleContractStatus event,
    Emitter<ContractsState> emit,
  ) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      emit(ContractOperationSuccess('تم تغيير حالة العقد بنجاح'));
      add(LoadContracts());
    } catch (e) {
      emit(ContractsError('فشل في تغيير حالة العقد: ${e.toString()}'));
    }
  }
}