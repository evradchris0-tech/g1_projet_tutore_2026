import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../models/incident_model.dart';
import '../../models/user_model.dart';
import '../../widgets/back_button_app_bar.dart';
import '../../widgets/error_state_widget.dart';
import '../../core/services/api_service.dart';
import '../../core/utils/haptic_feedback_util.dart';
import '../../providers/incident_provider.dart';
import '../../providers/auth_provider.dart';

class AgentIncidentDetailScreen extends ConsumerStatefulWidget {
  final String incidentId;

  const AgentIncidentDetailScreen({super.key, required this.incidentId});

  @override
  ConsumerState<AgentIncidentDetailScreen> createState() =>
      _AgentIncidentDetailScreenState();
}

class _AgentIncidentDetailScreenState
    extends ConsumerState<AgentIncidentDetailScreen> {
  bool _isUpdating = false;

  Future<void> _refreshIncident() async {
    HapticFeedbackUtil.light();
    ref.invalidate(incidentProvider(widget.incidentId));
  }

  Future<void> _takeChargeIncident(IncidentModel incident) async {
    HapticFeedbackUtil.medium();
    setState(() {
      _isUpdating = true;
    });

    try {
      final currentAgent = ref.read(authProvider.notifier).currentUser;
      String? agentId = currentAgent?.idUtilisateur;
      String? agentName;
      if (currentAgent is AgentTerrainModel) {
        agentName = currentAgent.name;
      }
      await ApiService.updateIncident(
        incident.id,
        {
          'status': 'in_progress',
          'takenAt': DateTime.now().toIso8601String(),
          'agentId': agentId ?? '1',
          'agentName': agentName ?? 'John Doe',
        },
      );

      // Invalider le provider pour recharger les données
      ref.invalidate(incidentProvider(widget.incidentId));
      ref.invalidate(incidentsProvider);

      HapticFeedbackUtil.success();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Incident pris en charge avec succès'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    } catch (e) {
      HapticFeedbackUtil.error();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: ${e.toString()}'),
            backgroundColor: AppTheme.dangerColor,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isUpdating = false;
        });
      }
    }
  }

  String _statusToString(IncidentStatus status) {
    return status.name;
  }

  Future<void> _resolveIncident(
      IncidentModel incident, IncidentStatus newStatus, String message) async {
    HapticFeedbackUtil.medium();
    setState(() {
      _isUpdating = true;
    });

    try {
      await ApiService.updateIncident(
        incident.id,
        {
          'status': _statusToString(newStatus),
          'resolvedAt': DateTime.now().toIso8601String(),
        },
      );

      // Invalider les providers pour recharger les données
      ref.invalidate(incidentProvider(widget.incidentId));
      ref.invalidate(incidentsProvider);
      ref.invalidate(historyIncidentsProvider);

      HapticFeedbackUtil.success();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(message),
            backgroundColor: AppTheme.successColor,
          ),
        );
        // Retourner à la liste des incidents après résolution
        Future.delayed(const Duration(seconds: 1), () {
          if (mounted) {
            context.pop();
          }
        });
      }
    } catch (e) {
      HapticFeedbackUtil.error();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: ${e.toString()}'),
            backgroundColor: AppTheme.dangerColor,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isUpdating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final incidentAsync = ref.watch(incidentProvider(widget.incidentId));

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(
        title: 'Détails de l\'incident',
        actions: [
          if (incidentAsync.hasValue)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _refreshIncident,
              tooltip: 'Actualiser',
            ),
        ],
      ),
      body: incidentAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => ErrorStateWidget(
          message: 'Erreur lors du chargement de l\'incident',
          onRetry: _refreshIncident,
        ),
        data: (incident) {
          if (incident == null) {
            return ErrorStateWidget(
              message: 'Incident introuvable',
              onRetry: _refreshIncident,
            );
          }

          return _buildIncidentDetails(context, incident);
        },
      ),
    );
  }

  Widget _buildIncidentDetails(BuildContext context, IncidentModel incident) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppConstants.spacingMd),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Photo
          if (incident.photoUrl != null)
            Card(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(
                  AppConstants.borderRadius,
                ),
                child: Image.network(
                  incident.photoUrl!,
                  height: 200,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            )
          else
            Card(
              child: Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppTheme.gray200,
                  borderRadius: BorderRadius.circular(
                    AppConstants.borderRadius,
                  ),
                ),
                child: const Icon(
                  Icons.image_outlined,
                  size: 64,
                  color: AppTheme.gray400,
                ),
              ),
            ),
          const SizedBox(height: AppConstants.spacingMd),

          // Informations principales
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    incident.equipmentType,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: AppConstants.spacingSm),
                  if (incident.description != null)
                    Text(
                      incident.description!,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  const SizedBox(height: AppConstants.spacingMd),
                  const Divider(),
                  const SizedBox(height: AppConstants.spacingMd),
                  _buildInfoRow(context, 'Bâtiment', incident.building),
                  const SizedBox(height: AppConstants.spacingSm),
                  _buildInfoRow(context, 'Étage', incident.floor),
                  const SizedBox(height: AppConstants.spacingSm),
                  _buildInfoRow(context, 'Chambre', incident.room),
                  const SizedBox(height: AppConstants.spacingSm),
                  _buildInfoRow(
                    context,
                    'Occupant',
                    incident.occupantName ?? 'N/A',
                  ),
                  const SizedBox(height: AppConstants.spacingSm),
                  _buildInfoRow(
                    context,
                    'Date de création',
                    DateFormat(
                      'dd/MM/yyyy à HH:mm',
                    ).format(incident.createdAtDateTime),
                  ),
                  if (incident.takenAt != null) ...[
                    const SizedBox(height: AppConstants.spacingSm),
                    _buildInfoRow(
                      context,
                      'Date de prise en charge',
                      DateFormat(
                        'dd/MM/yyyy à HH:mm',
                      ).format(incident.takenAt!),
                    ),
                  ],
                  if (incident.resolvedAt != null) ...[
                    const SizedBox(height: AppConstants.spacingSm),
                    _buildInfoRow(
                      context,
                      'Date de résolution',
                      DateFormat(
                        'dd/MM/yyyy à HH:mm',
                      ).format(incident.resolvedAt!),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: AppConstants.spacingMd),

          // Bouton voir sur la carte (plus fin)
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                context.push(
                  '/agent-location-map?building=${incident.building}&floor=${incident.floor}&room=${incident.room}',
                );
              },
              icon: const Icon(Icons.map_outlined, size: 16),
              label: const Text(
                'Voir l\'emplacement sur la carte',
                style: TextStyle(fontSize: 13),
              ),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacingSm,
                  vertical: AppConstants.spacingXs,
                ),
              ),
            ),
          ),
          const SizedBox(height: AppConstants.spacingMd),

          // Timeline
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTimelineItem(
                    context,
                    'Signalé',
                    DateFormat('dd MMM yyyy à HH:mm')
                        .format(incident.createdAtDateTime),
                    isCompleted: true,
                  ),
                  if (incident.takenAt != null)
                    _buildTimelineItem(
                      context,
                      'Pris en charge',
                      '${DateFormat('dd MMM yyyy à HH:mm').format(incident.takenAt!)} • Agent: Sarah J.',
                      isCompleted: true,
                    )
                  else
                    _buildTimelineItem(
                      context,
                      'Pris en charge',
                      'En attente',
                      isCompleted: false,
                    ),
                  if (incident.resolvedAt != null)
                    _buildTimelineItem(
                      context,
                      'Résolu',
                      DateFormat('dd MMM yyyy à HH:mm')
                          .format(incident.resolvedAt!),
                      isCompleted: true,
                    )
                  else
                    _buildTimelineItem(
                      context,
                      'Résolu',
                      'En attente',
                      isCompleted: false,
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppConstants.spacingMd),

          // Actions - Boutons plus fins comme dans la maquette
          if (_isUpdating)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(AppConstants.spacingMd),
                child: CircularProgressIndicator(),
              ),
            )
          else if ((incident.status == IncidentStatus.enAttentePriseEnCharge ||
                  (incident.agentId == null && incident.takenAt == null)) &&
              incident.status != IncidentStatus.resolu &&
              incident.status != IncidentStatus.annule) ...[
            _buildActionButton(
              context,
              icon: Icons.add_circle_outline,
              title: 'Prendre en charge',
              subtitle: 'Assigner l\'incident',
              color: AppTheme.primaryColor,
              onTap: () => _takeChargeIncident(incident),
            ),
          ] else if (incident.status == IncidentStatus.enCoursTraitement) ...[
            _buildActionButton(
              context,
              icon: Icons.check_circle_outline,
              title: 'Bon état',
              subtitle: 'Aucune intervention',
              color: AppTheme.successColor,
              onTap: () => _resolveIncident(
                incident,
                IncidentStatus.resolu,
                'Incident marqué comme "Bon état"',
              ),
            ),
            const SizedBox(height: AppConstants.spacingSm),
            _buildActionButton(
              context,
              icon: Icons.build_outlined,
              title: 'À remplacer',
              subtitle: 'Nécessite un remplacement',
              color: AppTheme.dangerColor,
              onTap: () => _resolveIncident(
                incident,
                IncidentStatus.enAttenteRemplacement,
                'Incident marqué comme "À remplacer"',
              ),
            ),
            const SizedBox(height: AppConstants.spacingSm),
            _buildActionButton(
              context,
              icon: Icons.settings_outlined,
              title: 'En maintenance',
              subtitle: 'Travaux en cours',
              color: AppTheme.primaryColor,
              onTap: () => _resolveIncident(
                incident,
                IncidentStatus.enAttentePiece,
                'Incident marqué comme "En maintenance"',
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: AppTheme.gray600),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w500),
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }

  Widget _buildTimelineItem(
    BuildContext context,
    String title,
    String date, {
    required bool isCompleted,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.spacingMd),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 12,
            height: 12,
            margin: const EdgeInsets.only(top: 4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isCompleted ? AppTheme.primaryColor : AppTheme.gray300,
            ),
          ),
          const SizedBox(width: AppConstants.spacingMd),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color:
                            isCompleted ? AppTheme.gray900 : AppTheme.gray500,
                      ),
                ),
                const SizedBox(height: 2),
                Text(
                  date,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.gray500,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppConstants.spacingMd,
          vertical: AppConstants.spacingSm,
        ),
        decoration: BoxDecoration(
          border: Border.all(color: AppTheme.gray200),
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: AppConstants.spacingMd),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.gray600,
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
