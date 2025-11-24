import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/building_model.dart';
import '../core/services/api_service.dart';

// Provider pour la liste des bâtiments
final buildingsProvider = FutureProvider<List<BuildingModel>>((ref) async {
  return await ApiService.getBuildings();
});

// Provider pour un bâtiment spécifique
final buildingProvider =
    FutureProvider.family<BuildingModel?, String>((ref, id) async {
  return await ApiService.getBuilding(id);
});















