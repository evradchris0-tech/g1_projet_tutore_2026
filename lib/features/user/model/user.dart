enum UserRole { occupant, client, admin }

UserRole userRoleFromString(String? s) {
  if (s == null) return UserRole.client;
  switch (s.toLowerCase()) {
    case 'occupant':
    case 'occuPANT':
      return UserRole.occupant;
    case 'admin':
      return UserRole.admin;
    case 'client':
    default:
      return UserRole.client;
  }
}

class User {
  final String id;
  final String username;
  final UserRole role;

  User({required this.id, required this.username, required this.role});

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id']?.toString() ?? '',
      username: map['username']?.toString() ?? '',
      role: userRoleFromString(map['role']?.toString()),
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'username': username,
        'role': role.toString().split('.').last,
      };
}
