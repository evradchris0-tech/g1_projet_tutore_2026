class AppConstants {
  // Application
  static const String appName = 'IMMO360';
  static const String appSubtitle = 'CAMEROUN';
  static const String appVersion = '1.0.0';

  // API
  static const String baseUrl = 'https://api.immo360.cm';
  static const Duration apiTimeout = Duration(seconds: 30);

  // Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyUserData = 'user_data';
  static const String keyIsLoggedIn = 'is_logged_in';
  static const String keyOfflineIncidents = 'offline_incidents';

  // Colors
  static const int primaryColorValue = 0xFF0D9488; // Teal
  static const int successColorValue = 0xFF10B981; // Green
  static const int warningColorValue = 0xFFF59E0B; // Amber
  static const int dangerColorValue = 0xFFEF4444; // Red

  // Spacing
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacing2xl = 48.0;

  // Sizes
  static const double borderRadius = 12.0;
  static const double buttonHeight = 48.0;
  static const double inputHeight = 48.0;

  // Hive Box Names
  static const String boxIncidents = 'incidents';
  static const String boxBuildings = 'buildings';
  static const String boxEquipment = 'equipment';
}
