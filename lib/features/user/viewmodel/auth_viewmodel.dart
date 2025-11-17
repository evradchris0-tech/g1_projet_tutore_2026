import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../../../core/database/db.dart';
import '../model/user.dart';

class AuthViewModel {
  AuthViewModel._();
  static final AuthViewModel instance = AuthViewModel._();

  final ValueNotifier<User?> user = ValueNotifier<User?>(null);

  // Replace with your real API base URL
  // String apiBase = 'http://192.168.1.104:4000';
  String apiBase = 'https://immo360-auth-service.onrender.com';

  /// Login using the API and persist token + user to sqlite.
  /// Returns true on success.
  Future<bool> login(String username, String password) async {
    try {
      final url = Uri.parse('$apiBase/auth/login');
      final res = await http.post(url, headers: {'Content-Type': 'application/json'}, body: jsonEncode({'username': username, 'password': password}));
      if (res.statusCode == 201) {
        final body = jsonDecode(res.body) as Map<String, dynamic>;
        if (body['success'] == true && body['data'] != null) {
          final data = body['data'] as Map<String, dynamic>;
          final token = data['access_token']?.toString() ?? '';
          final userMap = data['user'] as Map<String, dynamic>?;
          if (userMap == null) return false;
          final u = User.fromMap(userMap);
          user.value = u;
          // persist
          await DB.instance.saveAuth(id: u.id, username: u.username, role: u.role.toString().split('.').last, token: token);
          return true;
        }
        return false;
      }
    } catch (e) {
      if (kDebugMode) print('Login error: $e');
    }

    // Fallback to fake login for offline/dev convenience
    final role = await fakeLogin(username, password);
    if (role == null) return false;
    final u = User(id: username, username: username, role: role);
    user.value = u;
    await DB.instance.saveAuth(id: u.id, username: u.username, role: u.role.toString().split('.').last, token: '');
    return true;
  }

  void logout() async {
    user.value = null;
    await DB.instance.clearAuth();
  }

  static Future<UserRole?> fakeLogin(String username, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    if (username.isEmpty || password.isEmpty) return null;
    final first = username.toLowerCase()[0];
    if (first == 'c') return UserRole.client;
    return null;
  }

  /// Load persisted auth from sqlite (if any) and set `user`.
  Future<void> loadFromDb() async {
    final auth = await DB.instance.getAuth();
    if (auth == null) return;
    final u = User.fromMap(auth);
    user.value = u;
  }
}
