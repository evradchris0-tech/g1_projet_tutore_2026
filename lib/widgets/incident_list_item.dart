import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/theme/app_theme.dart';
import '../core/constants/app_constants.dart';
import '../models/incident_model.dart';

class IncidentListItem extends StatelessWidget {
  final IncidentModel incident;
  final VoidCallback onTap;

  const IncidentListItem({
    super.key,
    required this.incident,
    required this.onTap,
  });

  Color _getStatusColor(IncidentStatus status) {
    switch (status) {
      case IncidentStatus.enAttentePriseEnCharge:
        return AppTheme.warningColor;
      case IncidentStatus.enCoursTraitement:
        return AppTheme.primaryColor;
      case IncidentStatus.resolu:
        return AppTheme.successColor;
      case IncidentStatus.enAttenteRemplacement:
      case IncidentStatus.enAttentePiece:
        return AppTheme.dangerColor;
      case IncidentStatus.enAttenteValidation:
        return AppTheme.warningColor;
      case IncidentStatus.annule:
        return AppTheme.gray400;
      case IncidentStatus.escalade:
        return AppTheme.dangerColor;
    }
  }

  String _getStatusLabel(IncidentStatus status) {
    return status.label;
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return "Aujourd'hui";
    } else if (difference.inDays == 1) {
      return 'Il y a 1 jour';
    } else if (difference.inDays < 7) {
      return 'Il y a ${difference.inDays} jours';
    } else {
      return DateFormat('dd/MM/yyyy').format(date);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        side: BorderSide(
          color: AppTheme.gray200,
          width: 1,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.spacingMd),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icône avec fond coloré
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color:
                      _getStatusColor(incident.status).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.warning_amber_outlined,
                  color: _getStatusColor(incident.status),
                  size: 24,
                ),
              ),
              const SizedBox(width: AppConstants.spacingMd),
              // Informations principales
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Titre de l'équipement
                    Text(
                      incident.equipmentType,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    // Localisation avec gestion intelligente du débordement
                    Text(
                      '${incident.building} • ${incident.floor} • ${incident.room}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppTheme.gray600,
                            fontSize: 13,
                            height: 1.4,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      softWrap: true,
                    ),
                    const SizedBox(height: 6),
                    // Date formatée
                    Row(
                      children: [
                        Icon(
                          Icons.access_time,
                          size: 12,
                          color: AppTheme.gray500,
                        ),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            _formatDate(incident.createdAtDateTime),
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppTheme.gray500,
                                      fontSize: 12,
                                    ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppConstants.spacingSm),
              // Badge de statut avec contraintes
              Flexible(
                child: Container(
                  constraints: const BoxConstraints(
                    minWidth: 100,
                    maxWidth: 140,
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color:
                        _getStatusColor(incident.status).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _getStatusLabel(incident.status),
                    style: TextStyle(
                      color: _getStatusColor(incident.status),
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
