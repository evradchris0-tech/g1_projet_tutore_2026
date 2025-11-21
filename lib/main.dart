import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb, debugPrint;
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/routes/app_router.dart';
import 'core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialiser Hive pour le stockage local (uniquement sur mobile)
  if (!kIsWeb) {
    try {
      await Hive.initFlutter();
    } catch (e) {
      // Hive peut ne pas être disponible sur certaines plateformes
      debugPrint('Hive initialization skipped: $e');
    }
  }

  // Configuration de l'orientation (portrait uniquement) - uniquement sur mobile
  if (!kIsWeb) {
    try {
      await SystemChrome.setPreferredOrientations([
        DeviceOrientation.portraitUp,
        DeviceOrientation.portraitDown,
      ]);
    } catch (e) {
      debugPrint('Orientation setting skipped: $e');
    }
  }

  // Configuration de la barre de statut - uniquement sur mobile
  if (!kIsWeb) {
    try {
      SystemChrome.setSystemUIOverlayStyle(
        const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
        ),
      );
    } catch (e) {
      debugPrint('SystemUI overlay setting skipped: $e');
    }
  }

  runApp(const ProviderScope(child: ImmO360App()));
}

class ImmO360App extends ConsumerWidget {
  const ImmO360App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'IMMO360 CAMEROUN',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}
