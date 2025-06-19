class AppConstants {
  // App Information
  static const String appName = 'نظام إدارة العقارات';
  static const String appVersion = '1.0.0';

  // Colors (Material Design 3 inspired)
  static const int primaryColor = 0xFF2563EB; // Blue-600
  static const int secondaryColor = 0xFF059669; // Emerald-600
  static const int successColor = 0xFF16A34A; // Green-600
  static const int warningColor = 0xFFD97706; // Amber-600
  static const int errorColor = 0xFFDC2626; // Red-600
  static const int infoColor = 0xFF0891B2; // Cyan-600
  
  static const int backgroundColor = 0xFFF8FAFC; // Slate-50
  static const int surfaceColor = 0xFFFFFFFF; // White
  static const int cardColor = 0xFFFFFFFF; // White

  // Currency
  static const String currency = 'د.أ'; // Jordanian Dinar
  static const String currencyCode = 'JOD';

  // Database
  static const String databaseName = 'property_management.db';
  static const int databaseVersion = 1;

  // Property Types
  static const List<String> propertyTypes = [
    'شقة',
    'منزل',
    'فيلا',
    'محل تجاري',
    'مكتب',
    'مستودع',
    'أرض',
    'مبنى',
  ];

  // Expense Categories
  static const List<String> expenseCategories = [
    'صيانة',
    'قانونية',
    'تأمين',
    'نظافة',
    'أخرى',
  ];

  // Payment Methods
  static const List<String> paymentMethods = [
    'نقد',
    'تحويل بنكي',
    'شيك',
    'بطاقة ائتمان',
    'محفظة إلكترونية',
  ];

  // Date Formats
  static const String dateFormat = 'dd/MM/yyyy';
  static const String timeFormat = 'HH:mm';
  static const String dateTimeFormat = 'dd/MM/yyyy HH:mm';

  // Animation Durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);

  // Spacing
  static const double smallSpacing = 8.0;
  static const double mediumSpacing = 16.0;
  static const double largeSpacing = 24.0;
  static const double extraLargeSpacing = 32.0;

  // Border Radius
  static const double smallBorderRadius = 8.0;
  static const double mediumBorderRadius = 12.0;
  static const double largeBorderRadius = 16.0;
  static const double extraLargeBorderRadius = 24.0;

  // Icon Sizes
  static const double smallIconSize = 16.0;
  static const double mediumIconSize = 24.0;
  static const double largeIconSize = 32.0;
  static const double extraLargeIconSize = 48.0;

  // Text Sizes
  static const double captionTextSize = 12.0;
  static const double bodySmallTextSize = 14.0;
  static const double bodyTextSize = 16.0;
  static const double titleTextSize = 18.0;
  static const double headingTextSize = 20.0;
  static const double largeHeadingTextSize = 24.0;

  // API Endpoints (if needed for future integration)
  static const String baseUrl = 'https://api.property-management.com';
  static const String apiVersion = 'v1';

  // Validation Rules
  static const int minPasswordLength = 8;
  static const int maxNameLength = 100;
  static const int maxDescriptionLength = 500;
  static const int maxNotesLength = 1000;

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // File Limits
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageFormats = ['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedDocumentFormats = ['pdf', 'doc', 'docx', 'txt'];

  // Notification Settings
  static const Duration snackBarDuration = Duration(seconds: 3);
  static const Duration toastDuration = Duration(seconds: 2);

  // Chart Colors (for future analytics)
  static const List<int> chartColors = [
    0xFF2563EB, // Blue
    0xFF059669, // Emerald
    0xFFD97706, // Amber
    0xFFDC2626, // Red
    0xFF7C3AED, // Violet
    0xFFEC4899, // Pink
    0xFF0891B2, // Cyan
    0xFF65A30D, // Lime
  ];

  // Status Messages
  static const String successMessage = 'تم بنجاح';
  static const String errorMessage = 'حدث خطأ';
  static const String loadingMessage = 'جاري التحميل...';
  static const String noDataMessage = 'لا توجد بيانات';
  static const String networkErrorMessage = 'خطأ في الشبكة';
  static const String validationErrorMessage = 'خطأ في البيانات المدخلة';

  // Arabic Months
  static const List<String> arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  // Arabic Days
  static const List<String> arabicDays = [
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
    'الأحد',
  ];
}