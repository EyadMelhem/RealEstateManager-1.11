class AppConfig {
  static const String appName = 'إدارة العقارات';
  static const String appVersion = '1.0.0';
  static const String companyName = 'شركة إدارة العقارات';
  
  // Database configuration
  static const String databaseName = 'property_management.db';
  static const int databaseVersion = 1;
  
  // Currency settings
  static const String currency = 'د.أ';
  static const String currencyCode = 'JOD';
  static const String currencySymbol = 'JOD';
  
  // Date formats
  static const String apiDateFormat = 'yyyy-MM-dd';
  static const String displayDateFormat = 'dd/MM/yyyy';
  static const String timestampFormat = 'yyyy-MM-dd HH:mm:ss';
  
  // UI Configuration
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 12.0;
  static const double cardElevation = 2.0;
  
  // Animation durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 400);
  static const Duration longAnimation = Duration(milliseconds: 600);
}