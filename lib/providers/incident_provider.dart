import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/incident_model.dart';
import '../core/services/api_service.dart';

// Provider pour la liste des incidents
final incidentsProvider = FutureProvider<List<IncidentModel>>((ref) async {
  return await ApiService.getIncidents();
});

// Provider pour un incident spécifique
final incidentProvider =
    FutureProvider.family<IncidentModel?, String>((ref, id) async {
  return await ApiService.getIncident(id);
});

// Provider pour les incidents filtrés
final filteredIncidentsProvider =
    Provider.family<List<IncidentModel>, String>((ref, filter) {
  final incidents = ref.watch(incidentsProvider);

  return incidents.when(
    data: (data) {
      if (filter == 'Tous') return data;

      return data.where((incident) {
        switch (filter) {
          case 'Bon état':
            return incident.status == IncidentStatus.resolu;
          case 'À réparer':
            return incident.status == IncidentStatus.enAttentePriseEnCharge ||
                incident.status == IncidentStatus.enCoursTraitement;
          case 'À remplacer':
            return incident.status == IncidentStatus.enAttenteRemplacement;
          case 'En maintenance':
            return incident.status == IncidentStatus.enAttentePiece;
          default:
            return true;
        }
      }).toList();
    },
    loading: () => [],
    error: (_, __) => [],
  );
});

// Provider pour l'historique (incidents résolus)
final historyIncidentsProvider =
    FutureProvider<List<IncidentModel>>((ref) async {
  final incidents = await ApiService.getIncidents();
  return incidents
      .where((incident) =>
          incident.status == IncidentStatus.resolu ||
          incident.status == IncidentStatus.enAttenteRemplacement ||
          incident.dateResolution != null)
      .toList();
});
