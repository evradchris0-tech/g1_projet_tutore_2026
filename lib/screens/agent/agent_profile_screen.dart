import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';

class AgentProfileScreen extends StatelessWidget {
  const AgentProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Récupérer les données utilisateur depuis le provider
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(title: 'Profil'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppConstants.spacingMd),
        child: Column(
          children: [
            // Avatar
            const CircleAvatar(
              radius: 50,
              backgroundColor: AppTheme.primaryColor,
              child: Icon(Icons.person, size: 50, color: Colors.white),
            ),
            const SizedBox(height: AppConstants.spacingMd),
            Text('John Doe', style: Theme.of(context).textTheme.headlineMedium),
            Text(
              'Agent de maintenance',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.gray600),
            ),
            const SizedBox(height: AppConstants.spacingXl),

            // Informations
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.spacingMd),
                child: Column(
                  children: [
                    _buildProfileRow(context, 'Nom', 'John Doe'),
                    const Divider(),
                    _buildProfileRow(context, 'Email', 'john.doe@example.com'),
                    const Divider(),
                    _buildProfileRow(context, 'Rôle', 'Agent'),
                    const Divider(),
                    _buildProfileRow(context, 'Site', 'Eyang'),
                    const Divider(),
                    _buildProfileRow(
                      context,
                      'Statut',
                      'Actif',
                      valueColor: AppTheme.successColor,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppConstants.spacingXl),

            // Bouton de déconnexion
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // TODO: Déconnexion
                  context.go('/agent-login');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.dangerColor,
                  padding: const EdgeInsets.symmetric(
                    vertical: AppConstants.spacingMd,
                  ),
                ),
                child: const Text('Déconnexion'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileRow(
    BuildContext context,
    String label,
    String value, {
    Color? valueColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppConstants.spacingSm),
      child: Row(
        children: [
          Expanded(
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
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                    color: valueColor,
                  ),
              textAlign: TextAlign.end,
            ),
          ),
        ],
      ),
    );
  }
}
