import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/error_state_widget.dart';
import '../../models/building_model.dart';
import '../../providers/building_provider.dart';

class AgentBuildingScreen extends ConsumerStatefulWidget {
  const AgentBuildingScreen({super.key});

  @override
  ConsumerState<AgentBuildingScreen> createState() =>
      _AgentBuildingScreenState();
}

class _AgentBuildingScreenState extends ConsumerState<AgentBuildingScreen> {
  BuildingModel? _selectedBuilding;
  FloorModel? _selectedFloor;

  @override
  Widget build(BuildContext context) {
    final buildingsAsync = ref.watch(buildingsProvider);

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: AppBar(
        title: const Text('Bâtiments'),
        elevation: 0,
        centerTitle: false,
      ),
      body: buildingsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => ErrorStateWidget(
          message: 'Erreur lors du chargement des bâtiments',
          onRetry: () {
            ref.invalidate(buildingsProvider);
          },
        ),
        data: (buildings) {
          if (buildings.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.business_outlined,
              title: 'Aucun bâtiment',
              subtitle: 'Aucun bâtiment n\'a été trouvé',
            );
          }

          return _buildBuildingsContent(context, buildings);
        },
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 2),
    );
  }

  Widget _buildBuildingsContent(
      BuildContext context, List<BuildingModel> buildings) {
    // Trouver le bâtiment correspondant dans la nouvelle liste par ID
    // pour éviter les erreurs de comparaison d'objets
    BuildingModel? currentBuilding;
    FloorModel? currentFloor;

    if (_selectedBuilding != null) {
      try {
        currentBuilding = buildings.firstWhere(
          (b) => b.id == _selectedBuilding!.id,
        );

        // Trouver l'étage correspondant si un étage est sélectionné
        if (_selectedFloor != null) {
          try {
            currentFloor = currentBuilding.floors.firstWhere(
              (f) => f.id == _selectedFloor!.id,
            );
          } catch (e) {
            // L'étage n'existe plus, on le réinitialise
            currentFloor = null;
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) {
                setState(() {
                  _selectedFloor = null;
                });
              }
            });
          }
        }
      } catch (e) {
        // Le bâtiment n'existe plus dans la nouvelle liste
        currentBuilding = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _selectedBuilding = null;
              _selectedFloor = null;
            });
          }
        });
      }
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppConstants.spacingMd),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sélection du bâtiment
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sélectionner un bâtiment',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: AppConstants.spacingMd),
                  DropdownButtonFormField<BuildingModel>(
                    value: currentBuilding,
                    decoration: const InputDecoration(
                      labelText: 'Bâtiment',
                      border: OutlineInputBorder(),
                    ),
                    items: buildings.map((building) {
                      return DropdownMenuItem(
                        value: building,
                        child: Text(building.name),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedBuilding = value;
                        _selectedFloor = null;
                      });
                    },
                  ),
                  if (currentBuilding != null &&
                      currentBuilding.floors.isNotEmpty) ...[
                    const SizedBox(height: AppConstants.spacingMd),
                    DropdownButtonFormField<FloorModel>(
                      value: currentFloor,
                      decoration: const InputDecoration(
                        labelText: 'Étage',
                        border: OutlineInputBorder(),
                      ),
                      items: currentBuilding.floors.map((floor) {
                        return DropdownMenuItem(
                          value: floor,
                          child: Text(floor.number),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedFloor = value;
                        });
                      },
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: AppConstants.spacingXl),

          // Liste des chambres/bureaux
          if (currentBuilding != null && currentFloor != null) ...[
            Builder(
              builder: (context) {
                final building = currentBuilding!;
                final floor = currentFloor!;
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Chambres et bureaux',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    floor.rooms.isEmpty
                        ? Center(
                            child: Padding(
                              padding:
                                  const EdgeInsets.all(AppConstants.spacing2xl),
                              child: Text(
                                'Aucune chambre/bureau disponible',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(color: AppTheme.gray400),
                              ),
                            ),
                          )
                        : GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: AppConstants.spacingMd,
                              mainAxisSpacing: AppConstants.spacingMd,
                              childAspectRatio: 1.5,
                            ),
                            itemCount: floor.rooms.length,
                            itemBuilder: (context, index) {
                              final room = floor.rooms[index];
                              return Card(
                                child: InkWell(
                                  onTap: () {
                                    context.push(
                                      '/agent-room-detail?building=${Uri.encodeComponent(building.name)}&floor=${Uri.encodeComponent(floor.number)}&room=${Uri.encodeComponent(room.number)}',
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(
                                    AppConstants.borderRadius,
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(
                                      AppConstants.spacingMd,
                                    ),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Icon(
                                          Icons.home_outlined,
                                          size: 32,
                                          color: AppTheme.primaryColor,
                                        ),
                                        const SizedBox(
                                            height: AppConstants.spacingSm),
                                        Flexible(
                                          child: Text(
                                            room.name.isNotEmpty
                                                ? room.name
                                                : room.number,
                                            style: Theme.of(context)
                                                .textTheme
                                                .titleMedium,
                                            textAlign: TextAlign.center,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                  ],
                );
              },
            ),
          ] else
            Center(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.spacing2xl),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.business_outlined,
                      size: 64,
                      color: AppTheme.gray400,
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    Text(
                      'Sélectionnez un bâtiment et un étage',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(color: AppTheme.gray400),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
