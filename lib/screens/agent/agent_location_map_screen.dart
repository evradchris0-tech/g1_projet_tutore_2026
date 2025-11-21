import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';

class AgentLocationMapScreen extends StatelessWidget {
  final String building;
  final String floor;
  final String room;

  const AgentLocationMapScreen({
    super.key,
    required this.building,
    required this.floor,
    required this.room,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(title: 'Localisation'),
      body: Column(
        children: [
          // Informations de localisation
          Container(
            padding: const EdgeInsets.all(AppConstants.spacingMd),
            color: AppTheme.white,
            child: Row(
              children: [
                const Icon(Icons.location_on, color: AppTheme.primaryColor),
                const SizedBox(width: AppConstants.spacingSm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$building - $floor',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        'Chambre/Bureau: $room',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Carte (placeholder)
          Expanded(
            child: Container(
              color: AppTheme.gray200,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.map_outlined,
                      size: 64,
                      color: AppTheme.gray400,
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    Text(
                      'Carte interactive indoor',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppTheme.gray400,
                          ),
                    ),
                    const SizedBox(height: AppConstants.spacingSm),
                    Text(
                      'À implémenter avec Google Maps\nou solution de géolocalisation indoor',
                      style: Theme.of(
                        context,
                      ).textTheme.bodySmall?.copyWith(color: AppTheme.gray500),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
