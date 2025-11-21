import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class BackButtonAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final Widget? leading;

  const BackButtonAppBar({
    super.key,
    required this.title,
    this.actions,
    this.leading,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: leading ??
          IconButton(
            icon: const Icon(Icons.arrow_back_ios, size: 20),
            onPressed: () {
              if (context.canPop()) {
                context.pop();
              } else {
                // Si on ne peut pas faire pop, rediriger vers le dashboard
                context.go('/agent-dashboard');
              }
            },
            tooltip: 'Retour',
          ),
      title: Text(title),
      actions: actions,
      elevation: 0,
      centerTitle: false,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
