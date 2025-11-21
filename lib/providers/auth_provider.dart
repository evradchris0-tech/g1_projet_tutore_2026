import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';

// État de l'authentification
class AuthState {
  final UserModel? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    UserModel? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Provider pour l'état d'authentification
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());

  // Mock pour l'instant - à remplacer par un vrai service d'authentification
  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      // TODO: Appeler le service d'authentification
      await Future.delayed(const Duration(seconds: 1));

      // Mock user - créer un AgentTerrainModel
      final user = AgentTerrainModel(
        idUtilisateur: '1',
        email: email,
        nom: 'Doe',
        prenom: 'John',
        dateCreation: DateTime.now(),
      );

      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> logout() async {
    state = AuthState();
  }

  UserModel? get currentUser => state.user;
  String? get currentAgentId => state.user?.idUtilisateur;
  String? get currentAgentName {
    if (state.user is AgentTerrainModel) {
      return (state.user as AgentTerrainModel).name;
    }
    return null;
  }
}
