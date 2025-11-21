import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../models/incident_model.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/incident_list_item.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/error_state_widget.dart';
import '../../widgets/loading_skeleton.dart';
import '../../core/utils/haptic_feedback_util.dart';
import '../../providers/incident_provider.dart';

class AgentIncidentsScreen extends ConsumerStatefulWidget {
  const AgentIncidentsScreen({super.key});

  @override
  ConsumerState<AgentIncidentsScreen> createState() =>
      _AgentIncidentsScreenState();
}

class _AgentIncidentsScreenState extends ConsumerState<AgentIncidentsScreen> {
  String _selectedFilter = 'Tous';
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<String> _filters = [
    'Tous',
    'Bon état',
    'À réparer',
    'À remplacer',
    'En maintenance',
  ];

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text;
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<IncidentModel> _getFilteredIncidents(List<IncidentModel> incidents) {
    var filtered = incidents;

    // Filtre par statut
    if (_selectedFilter != 'Tous') {
      filtered = filtered.where((incident) {
        switch (_selectedFilter) {
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
    }

    // Filtre par recherche
    if (_searchQuery.isNotEmpty) {
      final searchQuery = _searchQuery.toLowerCase();
      filtered = filtered.where((incident) {
        final descriptionMatch = incident.description != null
            ? incident.description!.toLowerCase().contains(searchQuery)
            : false;
        return incident.equipmentType.toLowerCase().contains(searchQuery) ||
            descriptionMatch ||
            incident.room.toLowerCase().contains(searchQuery) ||
            incident.building.toLowerCase().contains(searchQuery);
      }).toList();
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    final incidentsAsync = ref.watch(incidentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: AppBar(
        title: const Text('Incidents'),
        elevation: 0,
        centerTitle: false,
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
          message: 'Erreur lors du chargement des incidents',
        ),
        data: (incidents) {
          final filteredIncidents = _getFilteredIncidents(incidents);

          return Column(
            children: [
              // Barre de recherche
              Padding(
                padding: const EdgeInsets.all(AppConstants.spacingMd),
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Rechercher des incidents...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              HapticFeedbackUtil.light();
                              _searchController.clear();
                            },
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppConstants.borderRadius),
                    ),
                  ),
                ),
              ),
              // Filtres
              Container(
                padding: const EdgeInsets.symmetric(
                  vertical: AppConstants.spacingMd,
                ),
                height: 60,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppConstants.spacingMd,
                  ),
                  itemCount: _filters.length,
                  itemBuilder: (context, index) {
                    final filter = _filters[index];
                    final isSelected = _selectedFilter == filter;
                    return Padding(
                      padding:
                          const EdgeInsets.only(right: AppConstants.spacingSm),
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
                          fontWeight:
                              isSelected ? FontWeight.w600 : FontWeight.normal,
                        ),
                      ),
                    );
                  },
                ),
              ),
              // Liste des incidents
              Expanded(
                child: filteredIncidents.isEmpty
                    ? EmptyStateWidget(
                        icon: Icons.inbox_outlined,
                        title: 'Aucun incident',
                        subtitle: _searchQuery.isNotEmpty
                            ? 'Aucun résultat pour "$_searchQuery"'
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
      bottomNavigationBar: const BottomNavBar(currentIndex: 1),
    );
  }
}
