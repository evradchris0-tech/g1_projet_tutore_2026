import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../screens/auth/agent_login_screen.dart';
import '../../screens/agent/agent_dashboard_screen.dart';
import '../../screens/agent/agent_incidents_screen.dart';
import '../../screens/agent/agent_building_screen.dart';
import '../../screens/agent/agent_history_screen.dart';
import '../../screens/agent/agent_incident_detail_screen.dart';
import '../../screens/agent/agent_location_map_screen.dart';
import '../../screens/agent/agent_profile_screen.dart';
import '../../screens/agent/agent_notifications_screen.dart';
import '../../screens/agent/agent_create_incident_screen.dart';
import '../../screens/agent/agent_management_screen.dart';
import '../../screens/agent/agent_room_detail_screen.dart';
import '../../screens/agent/agent_create_agent_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/agent-login',
    routes: [
      // Authentification
      GoRoute(
        path: '/agent-login',
        name: 'agent-login',
        builder: (context, state) => const AgentLoginScreen(),
      ),

      // Dashboard Agent
      GoRoute(
        path: '/agent-dashboard',
        name: 'agent-dashboard',
        builder: (context, state) => const AgentDashboardScreen(),
      ),

      // Incidents
      GoRoute(
        path: '/agent-incidents',
        name: 'agent-incidents',
        builder: (context, state) => const AgentIncidentsScreen(),
      ),

      // Bâtiments
      GoRoute(
        path: '/agent-building',
        name: 'agent-building',
        builder: (context, state) => const AgentBuildingScreen(),
      ),

      // Historique
      GoRoute(
        path: '/agent-history',
        name: 'agent-history',
        builder: (context, state) => const AgentHistoryScreen(),
      ),

      // Détails incident
      GoRoute(
        path: '/agent-incident-detail/:id',
        name: 'agent-incident-detail',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return AgentIncidentDetailScreen(incidentId: id);
        },
      ),

      // Carte de localisation
      GoRoute(
        path: '/agent-location-map',
        name: 'agent-location-map',
        builder: (context, state) {
          final building = state.uri.queryParameters['building'] ?? '';
          final floor = state.uri.queryParameters['floor'] ?? '';
          final room = state.uri.queryParameters['room'] ?? '';
          return AgentLocationMapScreen(
            building: building,
            floor: floor,
            room: room,
          );
        },
      ),

      // Profil
      GoRoute(
        path: '/agent-profile',
        name: 'agent-profile',
        builder: (context, state) => const AgentProfileScreen(),
      ),

      // Notifications
      GoRoute(
        path: '/agent-notifications',
        name: 'agent-notifications',
        builder: (context, state) => const AgentNotificationsScreen(),
      ),

      // Créer un incident
      GoRoute(
        path: '/agent-create-incident',
        name: 'agent-create-incident',
        builder: (context, state) => const AgentCreateIncidentScreen(),
      ),

      // Gestion des agents
      GoRoute(
        path: '/agent-management',
        name: 'agent-management',
        builder: (context, state) => const AgentManagementScreen(),
      ),

      // Créer un agent
      GoRoute(
        path: '/agent-create-agent',
        name: 'agent-create-agent',
        builder: (context, state) => const AgentCreateAgentScreen(),
      ),

      // Détails de la chambre
      GoRoute(
        path: '/agent-room-detail',
        name: 'agent-room-detail',
        builder: (context, state) {
          final building = state.uri.queryParameters['building'] ?? '';
          final floor = state.uri.queryParameters['floor'] ?? '';
          final room = state.uri.queryParameters['room'] ?? '';
          return AgentRoomDetailScreen(
            building: building,
            floor: floor,
            room: room,
          );
        },
      ),
    ],
  );
});
