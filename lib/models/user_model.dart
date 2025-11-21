// Enums selon les diagrammes UML
enum TypeUtilisateur {
  administrateur('Administrateur'),
  agentTerrain('Agent Terrain'),
  superviseur('Superviseur'),
  occupant('Occupant');

  const TypeUtilisateur(this.label);
  final String label;
}

enum StatutCompte {
  actif('Actif'),
  inactif('Inactif'),
  enAttente('En attente'),
  expire('Expiré'),
  bloque('Bloqué');

  const StatutCompte(this.label);
  final String label;
}

enum SpecialiteAgent {
  maintenance('Maintenance'),
  electricite('Électricité'),
  plomberie('Plomberie'),
  climatisation('Climatisation'),
  general('Général');

  const SpecialiteAgent(this.label);
  final String label;
}

// Classe de base Utilisateur selon UML
class UserModel {
  final String idUtilisateur;
  final String email;
  final String? motDePasseHash;
  final TypeUtilisateur typeUtilisateur;
  final StatutCompte statut;
  final DateTime dateCreation;
  final DateTime? dateDerniereConnexion;
  final String? tokenAuthentification;
  final DateTime? dateExpirationToken;

  UserModel({
    required this.idUtilisateur,
    required this.email,
    this.motDePasseHash,
    required this.typeUtilisateur,
    required this.statut,
    required this.dateCreation,
    this.dateDerniereConnexion,
    this.tokenAuthentification,
    this.dateExpirationToken,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      idUtilisateur: json['idUtilisateur'] as String? ?? json['id'] as String,
      email: json['email'] as String,
      motDePasseHash: json['motDePasseHash'] as String?,
      typeUtilisateur: _parseTypeUtilisateur(
          json['typeUtilisateur'] as String? ?? json['role'] as String?),
      statut: _parseStatutCompte(json['statut'] as String?),
      dateCreation: json['dateCreation'] != null
          ? DateTime.parse(json['dateCreation'] as String)
          : DateTime.now(),
      dateDerniereConnexion: json['dateDerniereConnexion'] != null
          ? DateTime.parse(json['dateDerniereConnexion'] as String)
          : null,
      tokenAuthentification: json['tokenAuthentification'] as String?,
      dateExpirationToken: json['dateExpirationToken'] != null
          ? DateTime.parse(json['dateExpirationToken'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idUtilisateur': idUtilisateur,
      'id': idUtilisateur, // Pour compatibilité
      'email': email,
      'motDePasseHash': motDePasseHash,
      'typeUtilisateur': typeUtilisateur.name,
      'role': typeUtilisateur.name, // Pour compatibilité
      'statut': statut.name,
      'dateCreation': dateCreation.toIso8601String(),
      'dateDerniereConnexion': dateDerniereConnexion?.toIso8601String(),
      'tokenAuthentification': tokenAuthentification,
      'dateExpirationToken': dateExpirationToken?.toIso8601String(),
    };
  }

  static TypeUtilisateur _parseTypeUtilisateur(String? value) {
    if (value == null) return TypeUtilisateur.agentTerrain;
    switch (value.toLowerCase()) {
      case 'administrateur':
      case 'admin':
        return TypeUtilisateur.administrateur;
      case 'agent_terrain':
      case 'agent':
        return TypeUtilisateur.agentTerrain;
      case 'superviseur':
        return TypeUtilisateur.superviseur;
      case 'occupant':
        return TypeUtilisateur.occupant;
      default:
        return TypeUtilisateur.agentTerrain;
    }
  }

  static StatutCompte _parseStatutCompte(String? value) {
    if (value == null) return StatutCompte.actif;
    switch (value.toLowerCase()) {
      case 'actif':
        return StatutCompte.actif;
      case 'inactif':
        return StatutCompte.inactif;
      case 'en_attente':
      case 'en attente':
        return StatutCompte.enAttente;
      case 'expire':
        return StatutCompte.expire;
      case 'bloque':
        return StatutCompte.bloque;
      default:
        return StatutCompte.actif;
    }
  }
}

// Classe AgentTerrain selon UML
class AgentTerrainModel extends UserModel {
  final String nom;
  final String prenom;
  final String? pseudo;
  final String? telephone;
  final SpecialiteAgent? specialite;
  final bool estSuperviseur;
  final DateTime? dateDerniereIntervention;
  final int nombreIncidentsTraites;
  final Duration? tempsReponseMoyen;

  AgentTerrainModel({
    required super.idUtilisateur,
    required super.email,
    super.motDePasseHash,
    required this.nom,
    required this.prenom,
    this.pseudo,
    this.telephone,
    this.specialite,
    this.estSuperviseur = false,
    required super.dateCreation,
    super.dateDerniereConnexion,
    super.statut = StatutCompte.actif,
    this.dateDerniereIntervention,
    this.nombreIncidentsTraites = 0,
    this.tempsReponseMoyen,
  }) : super(typeUtilisateur: TypeUtilisateur.agentTerrain);

  String get name => '$prenom $nom';
  String get fullName => '$prenom $nom';

  factory AgentTerrainModel.fromJson(Map<String, dynamic> json) {
    return AgentTerrainModel(
      idUtilisateur: json['idUtilisateur'] as String? ?? json['id'] as String,
      email: json['email'] as String,
      motDePasseHash: json['motDePasseHash'] as String?,
      nom: json['nom'] as String? ?? json['name']?.split(' ').last ?? 'N/A',
      prenom:
          json['prenom'] as String? ?? json['name']?.split(' ').first ?? 'N/A',
      pseudo: json['pseudo'] as String?,
      telephone: json['telephone'] as String? ?? json['phone'] as String?,
      specialite: json['specialite'] != null
          ? _parseSpecialite(json['specialite'] as String)
          : null,
      estSuperviseur: json['estSuperviseur'] as bool? ??
          ((json['role'] as String?) == 'supervisor' ||
              (json['typeUtilisateur'] as String?) == 'superviseur'),
      dateCreation: json['dateCreation'] != null
          ? DateTime.parse(json['dateCreation'] as String)
          : DateTime.now(),
      dateDerniereConnexion: json['dateDerniereConnexion'] != null
          ? DateTime.parse(json['dateDerniereConnexion'] as String)
          : null,
      statut: UserModel._parseStatutCompte(json['statut'] as String?),
      dateDerniereIntervention: json['dateDerniereIntervention'] != null
          ? DateTime.parse(json['dateDerniereIntervention'] as String)
          : null,
      nombreIncidentsTraites: json['nombreIncidentsTraites'] as int? ?? 0,
      tempsReponseMoyen: json['tempsReponseMoyen'] != null
          ? Duration(seconds: json['tempsReponseMoyen'] as int)
          : null,
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json.addAll({
      'nom': nom,
      'prenom': prenom,
      'name': name, // Pour compatibilité
      'pseudo': pseudo,
      'telephone': telephone,
      'phone': telephone, // Pour compatibilité
      'specialite': specialite?.name,
      'estSuperviseur': estSuperviseur,
      'dateDerniereIntervention': dateDerniereIntervention?.toIso8601String(),
      'nombreIncidentsTraites': nombreIncidentsTraites,
      'tempsReponseMoyen': tempsReponseMoyen?.inSeconds,
      'isActive': statut == StatutCompte.actif, // Pour compatibilité
    });
    return json;
  }

  static SpecialiteAgent _parseSpecialite(String value) {
    switch (value.toLowerCase()) {
      case 'maintenance':
        return SpecialiteAgent.maintenance;
      case 'electricite':
        return SpecialiteAgent.electricite;
      case 'plomberie':
        return SpecialiteAgent.plomberie;
      case 'climatisation':
        return SpecialiteAgent.climatisation;
      case 'general':
        return SpecialiteAgent.general;
      default:
        return SpecialiteAgent.general;
    }
  }
}
