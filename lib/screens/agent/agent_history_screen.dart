import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/incident_list_item.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/error_state_widget.dart';
import '../../widgets/loading_skeleton.dart';
import '../../models/incident_model.dart';
import '../../core/utils/haptic_feedback_util.dart';
import '../../providers/incident_provider.dart';

class AgentHistoryScreen extends ConsumerStatefulWidget {
  const AgentHistoryScreen({super.key});

  @override
  ConsumerState<AgentHistoryScreen> createState() => _AgentHistoryScreenState();
}

class _AgentHistoryScreenState extends ConsumerState<AgentHistoryScreen> {
  String _selectedFilter = 'Tous';
  DateTimeRange? _dateRange;

  final List<String> _filters = [
    'Tous',
    'Résolu',
    'À remplacer',
    'En maintenance',
    'Bon état',
  ];

  List<IncidentModel> _getFilteredIncidents(List<IncidentModel> incidents) {
    var filtered = incidents;

    // Filtre par statut
    if (_selectedFilter != 'Tous') {
      filtered = filtered.where((incident) {
        switch (_selectedFilter) {
          case 'Résolu':
            return incident.status == IncidentStatus.resolu;
          case 'À remplacer':
            return incident.status == IncidentStatus.enAttenteRemplacement;
          case 'En maintenance':
            return incident.status == IncidentStatus.enAttentePiece;
          case 'Bon état':
            return incident.status == IncidentStatus.resolu;
          default:
            return true;
        }
      }).toList();
    }

    // Filtre par date
    if (_dateRange != null) {
      filtered = filtered.where((incident) {
        final createdAt = incident.createdAtDateTime;
        return createdAt
                .isAfter(_dateRange!.start.subtract(const Duration(days: 1))) &&
            createdAt.isBefore(_dateRange!.end.add(const Duration(days: 1)));
      }).toList();
    }

    return filtered;
  }

  Future<void> _selectDateRange(BuildContext context) async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDateRange: _dateRange,
    );
    if (picked != null && picked != _dateRange) {
      setState(() {
        _dateRange = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final incidentsAsync = ref.watch(historyIncidentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: AppBar(
        title: const Text('Historique'),
        elevation: 0,
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // TODO: Ouvrir le dialogue de filtres avancés
            },
            tooltip: 'Filtres avancés',
          ),
        ],
      ),
      body: incidentsAsync.when(
        loading: () => ListView.builder(
          padding: const EdgeInsets.all(AppConstants.spacingMd),
          itemCount: 5,
          itemBuilder: (context, index) => const Padding(
            padding: EdgeInsets.only(bottom: AppConstants.spacingSm),
            child: IncidentListItemSkeleton(),
          ),
        ),
        error: (error, stack) => ErrorStateWidget(
          message: 'Erreur lors du chargement de l\'historique',
          onRetry: () {
            ref.invalidate(historyIncidentsProvider);
          },
        ),
        data: (incidents) {
          final filteredIncidents = _getFilteredIncidents(incidents);

          return Column(
            children: [
              // Filtres
              Container(
                padding: const EdgeInsets.all(AppConstants.spacingMd),
                child: Column(
                  children: [
                    // Filtres de statut
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _filters.length,
                        itemBuilder: (context, index) {
                          final filter = _filters[index];
                          final isSelected = _selectedFilter == filter;
                          return Padding(
                            padding: const EdgeInsets.only(
                              right: AppConstants.spacingSm,
                            ),
                            child: FilterChip(
                              label: Text(filter),
                              selected: isSelected,
                              onSelected: (selected) {
                                HapticFeedbackUtil.selection();
                                setState(() {
                                  _selectedFilter = filter;
                                });
                              },
                              selectedColor:
                                  AppTheme.primaryColor.withValues(alpha: 0.2),
                              checkmarkColor: AppTheme.primaryColor,
                              labelStyle: TextStyle(
                                color: isSelected
                                    ? AppTheme.primaryColor
                                    : AppTheme.gray700,
                                fontWeight: isSelected
                                    ? FontWeight.w600
                                    : FontWeight.normal,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    // Sélection de date
                    InkWell(
                      onTap: () => _selectDateRange(context),
                      child: Container(
                        padding: const EdgeInsets.all(AppConstants.spacingMd),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppTheme.gray300),
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadius,
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_today_outlined),
                            const SizedBox(width: AppConstants.spacingSm),
                            Text(
                              _dateRange == null
                                  ? 'Sélectionner une période'
                                  : '${_dateRange!.start.day}/${_dateRange!.start.month}/${_dateRange!.start.year} - ${_dateRange!.end.day}/${_dateRange!.end.month}/${_dateRange!.end.year}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Liste des incidents
              Expanded(
                child: filteredIncidents.isEmpty
                    ? EmptyStateWidget(
                        icon: Icons.history_outlined,
                        title: 'Aucun historique',
                        subtitle:
                            _selectedFilter != 'Tous' || _dateRange != null
                                ? 'Aucun résultat pour les filtres sélectionnés'
                                : null,
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppConstants.spacingMd,
                          vertical: AppConstants.spacingSm,
                        ),
                        itemCount: filteredIncidents.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(height: AppConstants.spacingXs),
                        itemBuilder: (context, index) {
                          final incident = filteredIncidents[index];
                          return IncidentListItem(
                            incident: incident,
                            onTap: () {
                              HapticFeedbackUtil.light();
                              context.push(
                                  '/agent-incident-detail/${incident.id}');
                            },
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 3),
    );
  }
}
