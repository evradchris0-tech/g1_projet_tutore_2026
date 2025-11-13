import 'package:flutter/material.dart';
import '../viewmodel/auth_viewmodel.dart';

class UserScreen extends StatelessWidget {
  const UserScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = AuthViewModel.instance.user.value;
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Username: ${user?.username ?? '-'}',
            style: const TextStyle(fontSize: 18),
          ),
          const SizedBox(height: 8),
          Text(
            'Role: ${user?.role.name ?? '-'}',
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              AuthViewModel.instance.logout();
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}
