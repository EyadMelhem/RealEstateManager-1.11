import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/property.dart';

// Events
abstract class PropertiesEvent extends Equatable {
  const PropertiesEvent();

  @override
  List<Object?> get props => [];
}

class LoadProperties extends PropertiesEvent {}

class AddProperty extends PropertiesEvent {
  final Property property;

  const AddProperty(this.property);

  @override
  List<Object> get props => [property];
}

class UpdateProperty extends PropertiesEvent {
  final Property property;

  const UpdateProperty(this.property);

  @override
  List<Object> get props => [property];
}

class DeleteProperty extends PropertiesEvent {
  final int propertyId;

  const DeleteProperty(this.propertyId);

  @override
  List<Object> get props => [propertyId];
}

class SearchProperties extends PropertiesEvent {
  final String query;

  const SearchProperties(this.query);

  @override
  List<Object> get props => [query];
}

class FilterProperties extends PropertiesEvent {
  final String? type;
  final bool? isAvailable;

  const FilterProperties({this.type, this.isAvailable});

  @override
  List<Object?> get props => [type, isAvailable];
}

// States
abstract class PropertiesState extends Equatable {
  const PropertiesState();

  @override
  List<Object> get props => [];
}

class PropertiesInitial extends PropertiesState {}

class PropertiesLoading extends PropertiesState {}

class PropertiesLoaded extends PropertiesState {
  final List<Property> properties;
  final List<Property> filteredProperties;
  final String? searchQuery;
  final String? selectedType;
  final bool? availabilityFilter;

  const PropertiesLoaded({
    required this.properties,
    required this.filteredProperties,
    this.searchQuery,
    this.selectedType,
    this.availabilityFilter,
  });

  @override
  List<Object?> get props => [
        properties,
        filteredProperties,
        searchQuery,
        selectedType,
        availabilityFilter,
      ];

  PropertiesLoaded copyWith({
    List<Property>? properties,
    List<Property>? filteredProperties,
    String? searchQuery,
    String? selectedType,
    bool? availabilityFilter,
  }) {
    return PropertiesLoaded(
      properties: properties ?? this.properties,
      filteredProperties: filteredProperties ?? this.filteredProperties,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedType: selectedType ?? this.selectedType,
      availabilityFilter: availabilityFilter ?? this.availabilityFilter,
    );
  }
}

class PropertiesError extends PropertiesState {
  final String message;

  const PropertiesError(this.message);

  @override
  List<Object> get props => [message];
}

class PropertyOperationSuccess extends PropertiesState {
  final String message;

  const PropertyOperationSuccess(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class PropertiesBloc extends Bloc<PropertiesEvent, PropertiesState> {
  PropertiesBloc() : super(PropertiesInitial()) {
    on<LoadProperties>(_onLoadProperties);
    on<AddProperty>(_onAddProperty);
    on<UpdateProperty>(_onUpdateProperty);
    on<DeleteProperty>(_onDeleteProperty);
    on<SearchProperties>(_onSearchProperties);
    on<FilterProperties>(_onFilterProperties);
  }

  Future<void> _onLoadProperties(
    LoadProperties event,
    Emitter<PropertiesState> emit,
  ) async {
    emit(PropertiesLoading());

    try {
      // TODO: Implement actual database loading
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Mock empty data for now
      const properties = <Property>[];

      emit(PropertiesLoaded(
        properties: properties,
        filteredProperties: properties,
      ));
    } catch (e) {
      emit(PropertiesError('فشل في تحميل العقارات: ${e.toString()}'));
    }
  }

  Future<void> _onAddProperty(
    AddProperty event,
    Emitter<PropertiesState> emit,
  ) async {
    if (state is PropertiesLoaded) {
      try {
        // TODO: Implement actual database insertion
        await Future.delayed(const Duration(milliseconds: 300));

        final currentState = state as PropertiesLoaded;
        final updatedProperties = List<Property>.from(currentState.properties)
          ..add(event.property);

        emit(PropertyOperationSuccess('تم إضافة العقار بنجاح'));
        emit(currentState.copyWith(
          properties: updatedProperties,
          filteredProperties: _applyFilters(
            updatedProperties,
            currentState.searchQuery,
            currentState.selectedType,
            currentState.availabilityFilter,
          ),
        ));
      } catch (e) {
        emit(PropertiesError('فشل في إضافة العقار: ${e.toString()}'));
      }
    }
  }

  Future<void> _onUpdateProperty(
    UpdateProperty event,
    Emitter<PropertiesState> emit,
  ) async {
    if (state is PropertiesLoaded) {
      try {
        // TODO: Implement actual database update
        await Future.delayed(const Duration(milliseconds: 300));

        final currentState = state as PropertiesLoaded;
        final updatedProperties = currentState.properties
            .map((p) => p.id == event.property.id ? event.property : p)
            .toList();

        emit(PropertyOperationSuccess('تم تحديث العقار بنجاح'));
        emit(currentState.copyWith(
          properties: updatedProperties,
          filteredProperties: _applyFilters(
            updatedProperties,
            currentState.searchQuery,
            currentState.selectedType,
            currentState.availabilityFilter,
          ),
        ));
      } catch (e) {
        emit(PropertiesError('فشل في تحديث العقار: ${e.toString()}'));
      }
    }
  }

  Future<void> _onDeleteProperty(
    DeleteProperty event,
    Emitter<PropertiesState> emit,
  ) async {
    if (state is PropertiesLoaded) {
      try {
        // TODO: Implement actual database deletion
        await Future.delayed(const Duration(milliseconds: 300));

        final currentState = state as PropertiesLoaded;
        final updatedProperties = currentState.properties
            .where((p) => p.id != event.propertyId)
            .toList();

        emit(PropertyOperationSuccess('تم حذف العقار بنجاح'));
        emit(currentState.copyWith(
          properties: updatedProperties,
          filteredProperties: _applyFilters(
            updatedProperties,
            currentState.searchQuery,
            currentState.selectedType,
            currentState.availabilityFilter,
          ),
        ));
      } catch (e) {
        emit(PropertiesError('فشل في حذف العقار: ${e.toString()}'));
      }
    }
  }

  Future<void> _onSearchProperties(
    SearchProperties event,
    Emitter<PropertiesState> emit,
  ) async {
    if (state is PropertiesLoaded) {
      final currentState = state as PropertiesLoaded;
      final filteredProperties = _applyFilters(
        currentState.properties,
        event.query,
        currentState.selectedType,
        currentState.availabilityFilter,
      );

      emit(currentState.copyWith(
        filteredProperties: filteredProperties,
        searchQuery: event.query,
      ));
    }
  }

  Future<void> _onFilterProperties(
    FilterProperties event,
    Emitter<PropertiesState> emit,
  ) async {
    if (state is PropertiesLoaded) {
      final currentState = state as PropertiesLoaded;
      final filteredProperties = _applyFilters(
        currentState.properties,
        currentState.searchQuery,
        event.type,
        event.isAvailable,
      );

      emit(currentState.copyWith(
        filteredProperties: filteredProperties,
        selectedType: event.type,
        availabilityFilter: event.isAvailable,
      ));
    }
  }

  List<Property> _applyFilters(
    List<Property> properties,
    String? searchQuery,
    String? type,
    bool? isAvailable,
  ) {
    var filtered = properties;

    if (searchQuery != null && searchQuery.isNotEmpty) {
      filtered = filtered
          .where((p) =>
              p.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
              p.address.toLowerCase().contains(searchQuery.toLowerCase()) ||
              p.ownerName.toLowerCase().contains(searchQuery.toLowerCase()))
          .toList();
    }

    if (type != null && type.isNotEmpty) {
      filtered = filtered.where((p) => p.type == type).toList();
    }

    if (isAvailable != null) {
      filtered = filtered.where((p) => p.isAvailable == isAvailable).toList();
    }

    return filtered;
  }
}