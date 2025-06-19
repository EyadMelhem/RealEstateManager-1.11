import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/tenant.dart';

// Events
abstract class TenantsEvent extends Equatable {
  const TenantsEvent();

  @override
  List<Object?> get props => [];
}

class LoadTenants extends TenantsEvent {}

class AddTenant extends TenantsEvent {
  final Tenant tenant;

  const AddTenant(this.tenant);

  @override
  List<Object> get props => [tenant];
}

class UpdateTenant extends TenantsEvent {
  final Tenant tenant;

  const UpdateTenant(this.tenant);

  @override
  List<Object> get props => [tenant];
}

class DeleteTenant extends TenantsEvent {
  final int tenantId;

  const DeleteTenant(this.tenantId);

  @override
  List<Object> get props => [tenantId];
}

class SearchTenants extends TenantsEvent {
  final String query;

  const SearchTenants(this.query);

  @override
  List<Object> get props => [query];
}

// States
abstract class TenantsState extends Equatable {
  const TenantsState();

  @override
  List<Object> get props => [];
}

class TenantsInitial extends TenantsState {}

class TenantsLoading extends TenantsState {}

class TenantsLoaded extends TenantsState {
  final List<Tenant> tenants;
  final List<Tenant> filteredTenants;
  final String? searchQuery;

  const TenantsLoaded({
    required this.tenants,
    required this.filteredTenants,
    this.searchQuery,
  });

  @override
  List<Object?> get props => [tenants, filteredTenants, searchQuery];

  TenantsLoaded copyWith({
    List<Tenant>? tenants,
    List<Tenant>? filteredTenants,
    String? searchQuery,
  }) {
    return TenantsLoaded(
      tenants: tenants ?? this.tenants,
      filteredTenants: filteredTenants ?? this.filteredTenants,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}

class TenantsError extends TenantsState {
  final String message;

  const TenantsError(this.message);

  @override
  List<Object> get props => [message];
}

class TenantOperationSuccess extends TenantsState {
  final String message;

  const TenantOperationSuccess(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class TenantsBloc extends Bloc<TenantsEvent, TenantsState> {
  TenantsBloc() : super(TenantsInitial()) {
    on<LoadTenants>(_onLoadTenants);
    on<AddTenant>(_onAddTenant);
    on<UpdateTenant>(_onUpdateTenant);
    on<DeleteTenant>(_onDeleteTenant);
    on<SearchTenants>(_onSearchTenants);
  }

  Future<void> _onLoadTenants(
    LoadTenants event,
    Emitter<TenantsState> emit,
  ) async {
    emit(TenantsLoading());

    try {
      await Future.delayed(const Duration(milliseconds: 500));
      const tenants = <Tenant>[];

      emit(TenantsLoaded(
        tenants: tenants,
        filteredTenants: tenants,
      ));
    } catch (e) {
      emit(TenantsError('فشل في تحميل المستأجرين: ${e.toString()}'));
    }
  }

  Future<void> _onAddTenant(
    AddTenant event,
    Emitter<TenantsState> emit,
  ) async {
    if (state is TenantsLoaded) {
      try {
        await Future.delayed(const Duration(milliseconds: 300));

        final currentState = state as TenantsLoaded;
        final updatedTenants = List<Tenant>.from(currentState.tenants)
          ..add(event.tenant);

        emit(TenantOperationSuccess('تم إضافة المستأجر بنجاح'));
        emit(currentState.copyWith(
          tenants: updatedTenants,
          filteredTenants: _applySearchFilter(
            updatedTenants,
            currentState.searchQuery,
          ),
        ));
      } catch (e) {
        emit(TenantsError('فشل في إضافة المستأجر: ${e.toString()}'));
      }
    }
  }

  Future<void> _onUpdateTenant(
    UpdateTenant event,
    Emitter<TenantsState> emit,
  ) async {
    if (state is TenantsLoaded) {
      try {
        await Future.delayed(const Duration(milliseconds: 300));

        final currentState = state as TenantsLoaded;
        final updatedTenants = currentState.tenants
            .map((t) => t.id == event.tenant.id ? event.tenant : t)
            .toList();

        emit(TenantOperationSuccess('تم تحديث المستأجر بنجاح'));
        emit(currentState.copyWith(
          tenants: updatedTenants,
          filteredTenants: _applySearchFilter(
            updatedTenants,
            currentState.searchQuery,
          ),
        ));
      } catch (e) {
        emit(TenantsError('فشل في تحديث المستأجر: ${e.toString()}'));
      }
    }
  }

  Future<void> _onDeleteTenant(
    DeleteTenant event,
    Emitter<TenantsState> emit,
  ) async {
    if (state is TenantsLoaded) {
      try {
        await Future.delayed(const Duration(milliseconds: 300));

        final currentState = state as TenantsLoaded;
        final updatedTenants = currentState.tenants
            .where((t) => t.id != event.tenantId)
            .toList();

        emit(TenantOperationSuccess('تم حذف المستأجر بنجاح'));
        emit(currentState.copyWith(
          tenants: updatedTenants,
          filteredTenants: _applySearchFilter(
            updatedTenants,
            currentState.searchQuery,
          ),
        ));
      } catch (e) {
        emit(TenantsError('فشل في حذف المستأجر: ${e.toString()}'));
      }
    }
  }

  Future<void> _onSearchTenants(
    SearchTenants event,
    Emitter<TenantsState> emit,
  ) async {
    if (state is TenantsLoaded) {
      final currentState = state as TenantsLoaded;
      final filteredTenants = _applySearchFilter(
        currentState.tenants,
        event.query,
      );

      emit(currentState.copyWith(
        filteredTenants: filteredTenants,
        searchQuery: event.query,
      ));
    }
  }

  List<Tenant> _applySearchFilter(
    List<Tenant> tenants,
    String? searchQuery,
  ) {
    if (searchQuery == null || searchQuery.isEmpty) {
      return tenants;
    }

    return tenants
        .where((t) =>
            t.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
            t.phone.contains(searchQuery) ||
            (t.email?.toLowerCase().contains(searchQuery.toLowerCase()) ?? false) ||
            (t.nationalId?.contains(searchQuery) ?? false))
        .toList();
  }
}