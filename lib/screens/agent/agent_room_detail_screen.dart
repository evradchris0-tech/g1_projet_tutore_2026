import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/error_state_widget.dart';
import '../../models/building_model.dart';
import '../../core/utils/haptic_feedback_util.dart';
import '../../providers/building_provider.dart';

class AgentRoomDetailScreen extends ConsumerStatefulWidget {
  final String building;
  final String floor;
  final String room;

  const AgentRoomDetailScreen({
    super.key,
    required this.building,
    required this.floor,
    required this.room,
  });

  @override
  ConsumerState<AgentRoomDetailScreen> createState() =>
      _AgentRoomDetailScreenState();
}

class _AgentRoomDetailScreenState extends ConsumerState<AgentRoomDetailScreen> {
  RoomModel? _foundRoom;
  BuildingModel? _foundBuilding;

  Future<void> _loadRoomData() async {
    final buildingsAsync = ref.read(buildingsProvider);
    await buildingsAsync.when(
      data: (buildings) {
        // Chercher le bâtiment par nom
        try {
          final building = buildings.firstWhere(
            (b) => b.name == widget.building,
          );

          // Chercher l'étage par numéro
          try {
            final floor = building.floors.firstWhere(
              (f) => f.number == widget.floor,
            );

            // Chercher la chambre par numéro ou nom
            try {
              final room = floor.rooms.firstWhere(
                (r) => r.number == widget.room || r.name == widget.room,
              );

              setState(() {
                _foundBuilding = building;
                _foundRoom = room;
              });
            } catch (e) {
              setState(() {
                _foundBuilding = building;
                _foundRoom = null;
              });
            }
          } catch (e) {
            setState(() {
              _foundBuilding = building;
              _foundRoom = null;
            });
          }
        } catch (e) {
          setState(() {
            _foundBuilding = null;
            _foundRoom = null;
          });
        }
      },
      loading: () {},
      error: (_, __) {},
    );
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRoomData();
    });
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Bon état':
        return AppTheme.successColor;
      case 'À réparer':
        return AppTheme.warningColor;
      case 'À remplacer':
        return AppTheme.dangerColor;
      case 'En maintenance':
        return AppTheme.primaryColor;
      default:
        return AppTheme.gray400;
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy', 'fr').format(date);
    } catch (e) {
      return 'N/A';
    }
  }

  void _showEquipmentStatusDialog(
    BuildContext context,
    String equipmentType,
    String currentStatus,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Modifier le statut de $equipmentType',
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Statut actuel: $currentStatus'),
            const SizedBox(height: AppConstants.spacingMd),
            const Text('Sélectionnez le nouveau statut:'),
            const SizedBox(height: AppConstants.spacingMd),
            ...['Bon état', 'À réparer', 'À remplacer', 'En maintenance']
                .map((status) {
              return ListTile(
                title: Text(status),
                leading: Radio<String>(
                  value: status,
                  groupValue: currentStatus,
                  onChanged: (value) {
                    Navigator.pop(context);
                    // TODO: Mettre à jour le statut
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Statut de $equipmentType mis à jour'),
                      ),
                    );
                  },
                ),
              );
            }),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final buildingsAsync = ref.watch(buildingsProvider);

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(
        title: widget.building,
      ),
      body: buildingsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => ErrorStateWidget(
          message: 'Erreur lors du chargement des données',
          onRetry: () {
            ref.invalidate(buildingsProvider);
            _loadRoomData();
          },
        ),
        data: (buildings) {
          // Recharger les données si nécessaire
          if (_foundRoom == null && _foundBuilding == null) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _loadRoomData();
            });
          }

          if (_foundRoom == null) {
            return EmptyStateWidget(
              icon: Icons.room_outlined,
              title: 'Chambre introuvable',
              subtitle:
                  'La chambre "${widget.room}" n\'a pas été trouvée dans ${widget.building}',
            );
          }

          final room = _foundRoom!;
          final equipment = room.equipment;

          // Calcul de la santé des équipements
          final totalEquipment = equipment.length;
          final goodEquipment =
              equipment.where((e) => e.status == 'Bon état').length;
          final healthPercentage = totalEquipment > 0
              ? (goodEquipment / totalEquipment * 100)
              : 100.0;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.spacingMd),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Informations de localisation
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppConstants.spacingMd),
                    child: Row(
                      children: [
                        Icon(Icons.location_on, color: AppTheme.primaryColor),
                        const SizedBox(width: AppConstants.spacingSm),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${widget.floor} • ${room.name.isNotEmpty ? room.name : room.number}',
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                              Text(
                                'Type: ${room.type}',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall
                                    ?.copyWith(
                                      color: AppTheme.gray600,
                                    ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.spacingMd),
                // Bouton voir sur la carte
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      HapticFeedbackUtil.light();
                      context.push(
                        '/agent-location-map?building=${Uri.encodeComponent(widget.building)}&floor=${Uri.encodeComponent(widget.floor)}&room=${Uri.encodeComponent(room.number)}',
                      );
                    },
                    icon: const Icon(Icons.map_outlined),
                    label: const Text('Voir l\'emplacement sur la carte'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        vertical: AppConstants.spacingSm,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.spacingMd),

                // Santé des équipements
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppConstants.spacingMd),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(
                              child: Text(
                                'Santé des équipements',
                                style: Theme.of(context).textTheme.titleMedium,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Text(
                              '${healthPercentage.toInt()}%',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.primaryColor,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppConstants.spacingMd),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: healthPercentage / 100,
                            minHeight: 8,
                            backgroundColor: AppTheme.gray200,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              AppTheme.primaryColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.spacingXl),

                // Liste des équipements
                Row(
                  children: [
                    Text(
                      'Liste des équipements',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ],
                ),
                const SizedBox(height: AppConstants.spacingSm),
                Row(
                  children: [
                    Icon(
                      Icons.info_outline,
                      size: 16,
                      color: AppTheme.gray500,
                    ),
                    const SizedBox(width: AppConstants.spacingXs),
                    Expanded(
                      child: Text(
                        'Cliquez sur un équipement pour modifier son statut',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppTheme.gray500,
                            ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppConstants.spacingMd),
                equipment.isEmpty
                    ? EmptyStateWidget(
                        icon: Icons.devices_outlined,
                        title: 'Aucun équipement',
                        subtitle:
                            'Cette chambre n\'a pas d\'équipement enregistré',
                      )
                    : Card(
                        child: ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: equipment.length,
                          separatorBuilder: (context, index) =>
                              const Divider(height: 1),
                          itemBuilder: (context, index) {
                            final eq = equipment[index];
                            final statusColor = _getStatusColor(eq.status);

                            return ListTile(
                              title: Text(
                                eq.type,
                                style: Theme.of(context).textTheme.titleMedium,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              subtitle: Text(
                                'Dernière vérification: ${eq.lastCheck != null ? _formatDate(eq.lastCheck!.toIso8601String()) : 'N/A'}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              trailing: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: statusColor.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: statusColor.withValues(alpha: 0.3),
                                  ),
                                ),
                                child: Text(
                                  eq.status,
                                  style: TextStyle(
                                    color: statusColor,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              onTap: () {
                                HapticFeedbackUtil.light();
                                _showEquipmentStatusDialog(
                                  context,
                                  eq.type,
                                  eq.status,
                                );
                              },
                            );
                          },
                        ),
                      ),
              ],
            ),
          );
        },
      ),
    );
  }
}
