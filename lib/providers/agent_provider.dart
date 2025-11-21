import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/services/api_service.dart';

// Provider pour la liste des agents
final agentsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  return await ApiService.getAgents();
});










