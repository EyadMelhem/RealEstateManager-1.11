import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import 'core/config/app_config.dart';
import 'core/database/database_helper.dart';
import 'core/routes/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/dashboard/presentation/bloc/dashboard_bloc.dart';
import 'features/properties/presentation/bloc/properties_bloc.dart';
import 'features/tenants/presentation/bloc/tenants_bloc.dart';
import 'features/contracts/presentation/bloc/contracts_bloc.dart';
import 'features/payments/presentation/bloc/payments_bloc.dart';
import 'features/expenses/presentation/bloc/expenses_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize database
  await DatabaseHelper.instance.database;
  
  runApp(const PropertyManagementApp());
}

class PropertyManagementApp extends StatelessWidget {
  const PropertyManagementApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MultiBlocProvider(
          providers: [
            BlocProvider(create: (context) => DashboardBloc()),
            BlocProvider(create: (context) => PropertiesBloc()),
            BlocProvider(create: (context) => TenantsBloc()),
            BlocProvider(create: (context) => ContractsBloc()),
            BlocProvider(create: (context) => PaymentsBloc()),
            BlocProvider(create: (context) => ExpensesBloc()),
          ],
          child: MaterialApp.router(
            title: 'إدارة العقارات',
            debugShowCheckedModeBanner: false,
            
            // Localization
            locale: const Locale('ar', 'JO'),
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('ar', 'JO'),
              Locale('en', 'US'),
            ],
            
            // Theme
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.light,
            
            // Routing
            routerConfig: AppRouter.router,
          ),
        );
      },
    );
  }
}