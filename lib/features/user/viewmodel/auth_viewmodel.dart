import 'package:flutter/foundation.dart';
import '../model/user.dart';

class AuthViewModel {
  AuthViewModel._();
  static final AuthViewModel instance = AuthViewModel._();

  final ValueNotifier<User?> user = ValueNotifier<User?>(null);

  Future<bool> login(String username, String password) async {
    final role = await fakeLogin(username, password);
    if (role == null) return false;
    user.value = User(id: username, username: username, role: role);
    return true;
  }

  void logout() {
    user.value = null;
  }

  static Future<UserRole?> fakeLogin(String username, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    if (username.isEmpty || password.isEmpty) return null;
    final first = username.toLowerCase()[0];
    if (first == 'c') return UserRole.client;
    return null;
  }
}
