import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;
import '../../models/incident_model.dart';
import '../../models/building_model.dart';

class ApiService {
  // Pour Android Emulator, utiliser 10.0.2.2
  // Pour iOS Simulator et Web, utiliser localhost
  // Pour appareil physique, utiliser l'IP de votre machine
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://10.0.2.2:3000';
    }
    if (Platform.isAndroid) {
      // Android Emulator utilise 10.0.2.2 pour accéder à localhost de la machine hôte
      return 'http://10.0.2.2:3000';
    }
    // iOS Simulator utilise localhost directement
    return 'http://localhost:3000';
  }

  // Buildings
  static Future<List<BuildingModel>> getBuildings() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/buildings'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final List<BuildingModel> buildings = [];

        for (var jsonItem in data) {
          try {
            buildings.add(BuildingModel.fromJson(jsonItem));
          } catch (e) {
            print('Erreur lors du parsing d\'un bâtiment: $e');
            continue;
          }
        }

        return buildings;
      }
      print('Erreur lors du chargement des bâtiments: ${response.statusCode}');
      return [];
    } catch (e) {
      print('Erreur lors du chargement des bâtiments: $e');
      return [];
    }
  }

  static Future<BuildingModel?> getBuilding(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/buildings/$id'));
      if (response.statusCode == 200) {
        return BuildingModel.fromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Incidents
  static Future<List<IncidentModel>> getIncidents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/incidents'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final List<IncidentModel> incidents = [];

        for (var jsonItem in data) {
          try {
            // Vérifier que l'incident a les champs requis
            if (jsonItem['id'] != null &&
                jsonItem['equipmentType'] != null &&
                jsonItem['building'] != null &&
                jsonItem['floor'] != null &&
                jsonItem['room'] != null &&
                jsonItem['createdAt'] != null &&
                jsonItem['status'] != null) {
              incidents.add(_incidentFromJson(jsonItem));
            }
          } catch (e) {
            // Ignorer les incidents invalides et continuer
            print('Erreur lors du parsing d\'un incident: $e');
            continue;
          }
        }

        return incidents;
      }
      throw Exception('Failed to load incidents: ${response.statusCode}');
    } catch (e) {
      print('Erreur lors du chargement des incidents: $e');
      return [];
    }
  }

  static Future<IncidentModel?> getIncident(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/incidents/$id'));
      if (response.statusCode == 200) {
        return _incidentFromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<IncidentModel> createIncident(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/incidents'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      if (response.statusCode == 201) {
        return _incidentFromJson(json.decode(response.body));
      }
      throw Exception('Failed to create incident');
    } catch (e) {
      rethrow;
    }
  }

  static Future<IncidentModel> updateIncident(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/incidents/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      if (response.statusCode == 200) {
        return _incidentFromJson(json.decode(response.body));
      }
      throw Exception('Failed to update incident');
    } catch (e) {
      rethrow;
    }
  }

  // Agents
  static Future<List<Map<String, dynamic>>> getAgents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/agents'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((agent) {
          // S'assurer que tous les champs nécessaires sont présents
          return {
            'id': agent['id'] ?? '',
            'name': agent['name'] ?? 'N/A',
            'email': agent['email'] ?? 'N/A',
            'isActive': agent['isActive'] ?? false,
            'role': agent['role'] ?? 'agent',
            'site': agent['site'] ?? 'Non spécifié',
          };
        }).toList();
      }
      print('Erreur lors du chargement des agents: ${response.statusCode}');
      return [];
    } catch (e) {
      print('Erreur lors du chargement des agents: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>> createAgent(
      Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/agents'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      }
      throw Exception('Failed to create agent: ${response.statusCode}');
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> updateAgent(String id, Map<String, dynamic> data) async {
    try {
      await http.put(
        Uri.parse('$baseUrl/agents/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
    } catch (e) {
      // Ignorer les erreurs pour le mock
    }
  }

  // Notifications
  static Future<List<Map<String, dynamic>>> getNotifications() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/notifications'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((notification) {
          // S'assurer que tous les champs nécessaires sont présents
          return {
            'id': notification['id'] ?? '',
            'title': notification['title'] ?? 'Sans titre',
            'body': notification['body'] ?? notification['message'] ?? '',
            'type': notification['type'] ?? 'info',
            'read': notification['read'] ?? false,
            'createdAt': notification['createdAt'] ??
                notification['time'] ??
                DateTime.now().toIso8601String(),
            'incidentId': notification['incidentId'],
          };
        }).toList();
      }
      print(
          'Erreur lors du chargement des notifications: ${response.statusCode}');
      return [];
    } catch (e) {
      print('Erreur lors du chargement des notifications: $e');
      return [];
    }
  }

  // Helpers
  static IncidentModel _incidentFromJson(Map<String, dynamic> json) {
    // Parser les dates de manière sécurisée
    DateTime? parseDate(dynamic dateValue) {
      if (dateValue == null) return null;
      try {
        if (dateValue is String) {
          return DateTime.parse(dateValue);
        }
        return null;
      } catch (e) {
        print('Erreur lors du parsing de la date: $dateValue - $e');
        return null;
      }
    }

    final createdAt = parseDate(json['createdAt']) ?? DateTime.now();
    final status =
        IncidentStatus.fromString(json['status'] as String? ?? 'pending');

    return IncidentModel(
      idIncident: json['id'] as String? ?? '',
      equipmentType: json['equipmentType'] as String? ?? 'Non spécifié',
      description: json['description'] as String?,
      photoPrincipale: json['photoUrl'] as String?,
      statut: status,
      building: json['building'] as String? ?? 'Non spécifié',
      floor: json['floor'] as String? ?? 'Non spécifié',
      room: json['room'] as String? ?? 'Non spécifié',
      occupantName: json['occupantName'] as String?,
      agentId: json['agentId'] as String?,
      agentName: json['agentName'] as String?,
      dateDeclaration: createdAt,
      datePriseEnCharge: parseDate(json['takenAt']),
      dateResolution: parseDate(json['resolvedAt']),
      commentaireAgent: json['comment'] as String?,
    );
  }
}
