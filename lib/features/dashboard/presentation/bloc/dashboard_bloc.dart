import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class DashboardEvent extends Equatable {
  const DashboardEvent();

  @override
  List<Object> get props => [];
}

class LoadDashboardData extends DashboardEvent {}

class RefreshDashboard extends DashboardEvent {}

// States
abstract class DashboardState extends Equatable {
  const DashboardState();

  @override
  List<Object> get props => [];
}

class DashboardInitial extends DashboardState {}

class DashboardLoading extends DashboardState {}

class DashboardLoaded extends DashboardState {
  final DashboardStats stats;
  final List<RecentActivity> recentActivities;

  const DashboardLoaded({
    required this.stats,
    required this.recentActivities,
  });

  @override
  List<Object> get props => [stats, recentActivities];
}

class DashboardError extends DashboardState {
  final String message;

  const DashboardError(this.message);

  @override
  List<Object> get props => [message];
}

// Data Models
class DashboardStats {
  final int totalProperties;
  final int activeTenants;
  final int activeContracts;
  final double monthlyRevenue;
  final double totalExpenses;
  final int overduePayments;
  final double totalCollected;
  final double pendingAmount;

  const DashboardStats({
    required this.totalProperties,
    required this.activeTenants,
    required this.activeContracts,
    required this.monthlyRevenue,
    required this.totalExpenses,
    required this.overduePayments,
    required this.totalCollected,
    required this.pendingAmount,
  });
}

class RecentActivity {
  final String title;
  final String description;
  final DateTime timestamp;
  final ActivityType type;

  const RecentActivity({
    required this.title,
    required this.description,
    required this.timestamp,
    required this.type,
  });
}

enum ActivityType {
  payment,
  contract,
  expense,
  tenant,
  property,
}

// BLoC
class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  DashboardBloc() : super(DashboardInitial()) {
    on<LoadDashboardData>(_onLoadDashboardData);
    on<RefreshDashboard>(_onRefreshDashboard);
  }

  Future<void> _onLoadDashboardData(
    LoadDashboardData event,
    Emitter<DashboardState> emit,
  ) async {
    emit(DashboardLoading());

    try {
      await Future.delayed(const Duration(milliseconds: 1000));

      // Sample data - in real app, this would come from repository
      const stats = DashboardStats(
        totalProperties: 0,
        activeTenants: 0,
        activeContracts: 0,
        monthlyRevenue: 0.0,
        totalExpenses: 0.0,
        overduePayments: 0,
        totalCollected: 0.0,
        pendingAmount: 0.0,
      );

      const recentActivities = <RecentActivity>[];

      emit(DashboardLoaded(
        stats: stats,
        recentActivities: recentActivities,
      ));
    } catch (e) {
      emit(DashboardError('فشل في تحميل بيانات لوحة التحكم: ${e.toString()}'));
    }
  }

  Future<void> _onRefreshDashboard(
    RefreshDashboard event,
    Emitter<DashboardState> emit,
  ) async {
    // Keep current state while refreshing
    if (state is DashboardLoaded) {
      final currentState = state as DashboardLoaded;
      emit(DashboardLoaded(
        stats: currentState.stats,
        recentActivities: currentState.recentActivities,
      ));
    }

    add(LoadDashboardData());
  }
}