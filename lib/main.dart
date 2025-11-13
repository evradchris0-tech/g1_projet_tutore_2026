import 'package:flutter/material.dart';
import 'package:mobile_client/features/user/view/login_screen.dart';
import 'package:mobile_client/features/user/viewmodel/auth_viewmodel.dart';
import 'package:mobile_client/shared/widgets/shell_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Immo 360 Client',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      home: ValueListenableBuilder(valueListenable: AuthViewModel.instance.user, builder: (context, user, _) {
        if (user == null) return const LoginScreen();
          return const ShellScreen();
      }),
    );
  }
}