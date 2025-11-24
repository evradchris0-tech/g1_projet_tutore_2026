import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/services/api_service.dart';

// Provider pour les notifications
final notificationsProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  return await ApiService.getNotifications();
});

// Provider pour le nombre de notifications non lues
final unreadNotificationsCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationsProvider);

  return notifications.when(
    data: (data) => data.where((n) => !(n['read'] as bool? ?? false)).length,
    loading: () => 0,
    error: (_, __) => 0,
  );
});















