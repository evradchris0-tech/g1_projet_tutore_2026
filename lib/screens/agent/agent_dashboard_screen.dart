import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/kpi_card.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../providers/incident_provider.dart';
import '../../providers/notification_provider.dart';
import '../../models/incident_model.dart';

class AgentDashboardScreen extends ConsumerStatefulWidget {
  const AgentDashboardScreen({super.key});

  @override
  ConsumerState<AgentDashboardScreen> createState() =>
      _AgentDashboardScreenState();
}

class _AgentDashboardScreenState extends ConsumerState<AgentDashboardScreen> {
  String _selectedPeriod = 'Mensuelle';

  final List<String> _periods = [
    'Mensuelle',
    'Journalière',
    'Hebdomadaire',
    'Semestrielle',
    'Annuelle',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tableau de bord',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            Text('Site Eyang', style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
        actions: [
          // Notifications
          Consumer(
            builder: (context, ref, child) {
              final unreadCount = ref.watch(unreadNotificationsCountProvider);
              return Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined),
                    onPressed: () => context.go('/agent-notifications'),
                  ),
                  if (unreadCount > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppTheme.dangerColor,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          unreadCount > 99 ? '99+' : '$unreadCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
          // Profil
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.go('/agent-profile'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppConstants.spacingMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sélecteur de période
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.spacingMd),
                child: DropdownButtonFormField<String>(
                  value: _selectedPeriod,
                  decoration: const InputDecoration(
                    labelText: 'Période',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  items: _periods.map((period) {
                    return DropdownMenuItem(
                      value: period,
                      child: Text('Période: $period'),
                    );
                  }).toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        _selectedPeriod = value;
                      });
                    }
                  },
                ),
              ),
            ),
            const SizedBox(height: AppConstants.spacingMd),

            // KPI Cards
            Consumer(
              builder: (context, ref, child) {
                final incidentsAsync = ref.watch(incidentsProvider);
                return incidentsAsync.when(
                  loading: () => const Row(
                    children: [
                      Expanded(
                          child: KPICard(
                              value: '...',
                              label: 'Bon état',
                              color: AppTheme.successColor)),
                      SizedBox(width: AppConstants.spacingMd),
                      Expanded(
                          child: KPICard(
                              value: '...',
                              label: 'À réparer',
                              color: AppTheme.warningColor)),
                    ],
                  ),
                  error: (_, __) => const Row(
                    children: [
                      Expanded(
                          child: KPICard(
                              value: '0',
                              label: 'Bon état',
                              color: AppTheme.successColor)),
                      SizedBox(width: AppConstants.spacingMd),
                      Expanded(
                          child: KPICard(
                              value: '0',
                              label: 'À réparer',
                              color: AppTheme.warningColor)),
                    ],
                  ),
                  data: (incidents) {
                    final goodCondition = incidents
                        .where((i) => i.status == IncidentStatus.resolu)
                        .length;
                    final toRepair = incidents
                        .where((i) =>
                            i.status == IncidentStatus.enAttentePriseEnCharge ||
                            i.status == IncidentStatus.enCoursTraitement)
                        .length;
                    final toReplace = incidents
                        .where((i) =>
                            i.status == IncidentStatus.enAttenteRemplacement)
                        .length;
                    final inMaintenance = incidents
                        .where((i) => i.status == IncidentStatus.enAttentePiece)
                        .length;

                    return Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: KPICard(
                                value: '$goodCondition',
                                label: 'Bon état',
                                color: AppTheme.successColor,
                              ),
                            ),
                            const SizedBox(width: AppConstants.spacingMd),
                            Expanded(
                              child: KPICard(
                                value: '$toRepair',
                                label: 'À réparer',
                                color: AppTheme.warningColor,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppConstants.spacingMd),
                        Row(
                          children: [
                            Expanded(
                              child: KPICard(
                                value: '$toReplace',
                                label: 'À remplacer',
                                color: AppTheme.dangerColor,
                              ),
                            ),
                            const SizedBox(width: AppConstants.spacingMd),
                            Expanded(
                              child: KPICard(
                                value: '$inMaintenance',
                                label: 'En maintenance',
                                color: AppTheme.primaryColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    );
                  },
                );
              },
            ),
            const SizedBox(height: AppConstants.spacingXl),

            // Graphique: Incidents par bâtiment
            Consumer(
              builder: (context, ref, child) {
                final incidentsAsync = ref.watch(incidentsProvider);
                return incidentsAsync.when(
                  loading: () => Card(
                    child: Padding(
                      padding: const EdgeInsets.all(AppConstants.spacingMd),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Incidents par bâtiment',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: AppConstants.spacingMd),
                          const Center(
                            child: CircularProgressIndicator(),
                          ),
                        ],
                      ),
                    ),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                  data: (incidents) {
                    // Calculer les incidents par bâtiment
                    final Map<String, int> buildingCounts = {};
                    for (var incident in incidents) {
                      buildingCounts[incident.building] =
                          (buildingCounts[incident.building] ?? 0) + 1;
                    }

                    final buildingsData = buildingCounts.entries
                        .map((e) => {
                              'name': e.key,
                              'value': e.value,
                            })
                        .toList();

                    if (buildingsData.isEmpty) {
                      return const SizedBox.shrink();
                    }

                    final maxValue = buildingsData
                        .map((b) => b['value'] as int)
                        .reduce((a, b) => a > b ? a : b);

                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(AppConstants.spacingMd),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Incidents par bâtiment',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: AppConstants.spacingMd),
                            SizedBox(
                              height: 200,
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: buildingsData.map((building) {
                                  final value = building['value'] as int;
                                  return Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4,
                                      ),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.end,
                                        children: [
                                          Flexible(
                                            child: Container(
                                              height: maxValue > 0
                                                  ? (value / maxValue) * 150
                                                  : 0,
                                              decoration: BoxDecoration(
                                                color: AppTheme.primaryColor,
                                                borderRadius:
                                                    BorderRadius.circular(4),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Flexible(
                                            child: Text(
                                              building['name'] as String,
                                              style: Theme.of(context)
                                                  .textTheme
                                                  .bodySmall,
                                              textAlign: TextAlign.center,
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          Text(
                                            '${building['value']}',
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodySmall
                                                ?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
            const SizedBox(height: AppConstants.spacingXl),

            // Bouton Exporter Excel
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  // TODO: Exporter en Excel
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Export Excel en cours...'),
                    ),
                  );
                },
                icon: const Icon(Icons.file_download_outlined),
                label: const Text('Exporter Excel'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    vertical: AppConstants.spacingMd,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppConstants.spacingMd),

            // Bouton Gestion des agents (Superviseur)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  context.go('/agent-management');
                },
                icon: const Icon(Icons.people_outline),
                label: const Text('Gestion des agents'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    vertical: AppConstants.spacingMd,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.push('/agent-create-incident');
        },
        child: const Icon(Icons.add),
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 0),
    );
  }
}
