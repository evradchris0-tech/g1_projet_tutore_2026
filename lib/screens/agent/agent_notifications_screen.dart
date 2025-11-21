import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/error_state_widget.dart';
import '../../widgets/loading_skeleton.dart';
import '../../core/utils/haptic_feedback_util.dart';
import '../../providers/notification_provider.dart';

class AgentNotificationsScreen extends ConsumerStatefulWidget {
  const AgentNotificationsScreen({super.key});

  @override
  ConsumerState<AgentNotificationsScreen> createState() =>
      _AgentNotificationsScreenState();
}

class _AgentNotificationsScreenState
    extends ConsumerState<AgentNotificationsScreen> {
  Future<void> _refreshNotifications() async {
    HapticFeedbackUtil.light();
    ref.invalidate(notificationsProvider);
  }

  @override
  Widget build(BuildContext context) {
    final notificationsAsync = ref.watch(notificationsProvider);

    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(
        title: 'Notifications',
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshNotifications,
            tooltip: 'Actualiser',
          ),
        ],
      ),
      body: notificationsAsync.when(
        loading: () => ListView.builder(
          padding: const EdgeInsets.all(AppConstants.spacingMd),
          itemCount: 5,
          itemBuilder: (context, index) => Padding(
            padding: const EdgeInsets.only(bottom: AppConstants.spacingSm),
            child: Card(
              child: ListTile(
                leading: const LoadingSkeleton(width: 48, height: 48),
                title: const LoadingSkeleton(width: 200, height: 16),
                subtitle: const LoadingSkeleton(width: 150, height: 12),
              ),
            ),
          ),
        ),
        error: (error, stack) => ErrorStateWidget(
          message: 'Erreur lors du chargement des notifications',
          onRetry: _refreshNotifications,
        ),
        data: (notifications) {
          if (notifications.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.notifications_none_outlined,
              title: 'Aucune notification',
              subtitle: 'Vous n\'avez aucune notification',
            );
          }

          return RefreshIndicator(
            onRefresh: _refreshNotifications,
            child: ListView.separated(
              padding: const EdgeInsets.all(AppConstants.spacingMd),
              itemCount: notifications.length,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppConstants.spacingSm),
              itemBuilder: (context, index) {
                final notification = notifications[index];
                final isRead = notification['read'] as bool? ?? false;
                final time = notification['time'] as DateTime?;
                final incidentId = notification['incidentId'] as String?;
                final type = notification['type'] as String? ?? 'info';

                return Card(
                  color: isRead
                      ? AppTheme.white
                      : AppTheme.primaryColor.withValues(alpha: 0.05),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor:
                          AppTheme.primaryColor.withValues(alpha: 0.1),
                      child: const Icon(
                        Icons.notifications_outlined,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    title: Text(
                      notification['title'] as String? ?? 'Notification',
                      style: Theme.of(
                        context,
                      ).textTheme.titleMedium?.copyWith(
                            fontWeight:
                                isRead ? FontWeight.normal : FontWeight.w600,
                          ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text(notification['body'] as String? ??
                            notification['message'] as String? ??
                            ''),
                        const SizedBox(height: 4),
                        Text(
                          notification['createdAt'] != null
                              ? DateFormat('dd/MM/yyyy à HH:mm').format(
                                  DateTime.parse(
                                      notification['createdAt'] as String))
                              : time != null
                                  ? DateFormat('dd/MM/yyyy à HH:mm')
                                      .format(time)
                                  : '',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                    trailing: !isRead
                        ? Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppTheme.primaryColor,
                              shape: BoxShape.circle,
                            ),
                          )
                        : null,
                    onTap: () {
                      HapticFeedbackUtil.light();
                      // Si la notification est liée à un incident, naviguer vers l'incident
                      if (incidentId != null &&
                          (type == 'incident' || type == 'urgent')) {
                        // Naviguer vers l'onglet incidents puis vers le détail de l'incident
                        context.go('/agent-incidents');
                        // Attendre un peu pour que la navigation soit complète
                        Future.delayed(const Duration(milliseconds: 300), () {
                          if (context.mounted) {
                            context.push('/agent-incident-detail/$incidentId');
                          }
                        });
                      }
                    },
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
