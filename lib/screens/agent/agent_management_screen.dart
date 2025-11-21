import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/error_state_widget.dart';
import '../../widgets/loading_skeleton.dart';
import '../../core/services/api_service.dart';
import '../../core/utils/haptic_feedback_util.dart';
import '../../providers/agent_provider.dart';

class AgentManagementScreen extends ConsumerStatefulWidget {
  const AgentManagementScreen({super.key});

  @override
  ConsumerState<AgentManagementScreen> createState() =>
      _AgentManagementScreenState();
}

class _AgentManagementScreenState extends ConsumerState<AgentManagementScreen> {
  Future<void> _refreshAgents() async {
    HapticFeedbackUtil.light();
    ref.invalidate(agentsProvider);
  }

  Future<void> _toggleAgentStatus(Map<String, dynamic> agent, int index) async {
    HapticFeedbackUtil.selection();
    final newStatus = !(agent['isActive'] as bool? ?? false);

    try {
      await ApiService.updateAgent(
        agent['id'] as String,
        {'isActive': newStatus},
      );
      // Invalider le provider pour recharger les données
      ref.invalidate(agentsProvider);
      HapticFeedbackUtil.success();
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
    }
  }

  void _showAddAgentDialog() {
    context.push('/agent-create-agent').then((success) {
      if (success == true) {
        // Rafraîchir la liste des agents
        ref.invalidate(agentsProvider);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final agentsAsync = ref.watch(agentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(
        title: 'Gestion des agents',
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshAgents,
            tooltip: 'Actualiser',
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddAgentDialog,
            tooltip: 'Ajouter agent',
          ),
        ],
      ),
      body: agentsAsync.when(
        loading: () => ListView.builder(
          padding: const EdgeInsets.all(AppConstants.spacingMd),
          itemCount: 5,
          itemBuilder: (context, index) => Padding(
            padding: const EdgeInsets.only(bottom: AppConstants.spacingSm),
            child: Card(
              child: ListTile(
                leading: const LoadingSkeleton(width: 40, height: 40),
                title: const LoadingSkeleton(width: 150, height: 16),
                subtitle: const LoadingSkeleton(width: 200, height: 12),
                trailing: const LoadingSkeleton(width: 50, height: 24),
              ),
            ),
          ),
        ),
        error: (error, stack) => ErrorStateWidget(
          message: 'Erreur lors du chargement des agents',
          onRetry: _refreshAgents,
        ),
        data: (agents) {
          if (agents.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.people_outline,
              title: 'Aucun agent',
              subtitle: 'Aucun agent n\'a été trouvé',
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(AppConstants.spacingMd),
                  itemCount: agents.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: AppConstants.spacingSm),
                  itemBuilder: (context, index) {
                    final agent = agents[index];
                    final isActive = agent['isActive'] as bool? ?? false;

                    return Card(
                      child: ListTile(
                        title: Text(
                          agent['name'] as String? ?? 'N/A',
                          style: Theme.of(context).textTheme.titleMedium,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        subtitle: Text(
                          agent['email'] as String? ?? '',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        trailing: Switch(
                          value: isActive,
                          onChanged: (_) => _toggleAgentStatus(agent, index),
                          activeColor: AppTheme.successColor,
                        ),
                      ),
                    );
                  },
                ),
              ),
              // Note informative
              Container(
                margin: const EdgeInsets.all(AppConstants.spacingMd),
                padding: const EdgeInsets.all(AppConstants.spacingMd),
                decoration: BoxDecoration(
                  color: AppTheme.gray100,
                  borderRadius:
                      BorderRadius.circular(AppConstants.borderRadius),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.info_outline,
                      color: AppTheme.gray600,
                      size: 20,
                    ),
                    const SizedBox(width: AppConstants.spacingSm),
                    Expanded(
                      child: Text(
                        'Un agent désactivé ne pourra pas se connecter à l\'application mobile.',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: AppTheme.gray600),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
