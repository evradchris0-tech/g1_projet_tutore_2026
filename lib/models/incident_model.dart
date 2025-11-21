// Enums selon les diagrammes UML
enum TypeDeclarant {
  occupant('Occupant'),
  agentTerrain('Agent Terrain');

  const TypeDeclarant(this.label);
  final String label;
}

enum PrioriteIncident {
  critique('Critique'),
  haute('Haute'),
  moyenne('Moyenne'),
  basse('Basse');

  const PrioriteIncident(this.label);
  final String label;
}

enum IncidentStatus {
  enAttentePriseEnCharge('En attente'),
  enCoursTraitement('En cours de traitement'),
  enAttentePiece('En attente'),
  enAttenteValidation('En attente'),
  resolu('Résolu'),
  enAttenteRemplacement('En attente'),
  annule('Annulé'),
  escalade('Escalade');

  const IncidentStatus(this.label);
  final String label;

  // Pour compatibilité avec l'ancien système
  static IncidentStatus fromString(String? value) {
    if (value == null) return IncidentStatus.enAttentePriseEnCharge;
    switch (value.toLowerCase()) {
      case 'pending':
      case 'en_attente':
        return IncidentStatus.enAttentePriseEnCharge;
      case 'in_progress':
      case 'en_cours':
        return IncidentStatus.enCoursTraitement;
      case 'resolved':
      case 'resolu':
        return IncidentStatus.resolu;
      case 'to_replace':
      case 'a_remplacer':
        return IncidentStatus.enAttenteRemplacement;
      case 'in_maintenance':
      case 'en_maintenance':
      case 'en_attente_piece':
        return IncidentStatus.enAttentePiece;
      case 'en_attente_validation':
        return IncidentStatus.enAttenteValidation;
      case 'good_condition':
      case 'bon_etat':
        return IncidentStatus.resolu;
      case 'annule':
      case 'cancelled':
        return IncidentStatus.annule;
      case 'escalade':
        return IncidentStatus.escalade;
      default:
        return IncidentStatus.enAttentePriseEnCharge;
    }
  }

  // Pour compatibilité avec l'ancien système
  String get name {
    switch (this) {
      case IncidentStatus.enAttentePriseEnCharge:
        return 'pending';
      case IncidentStatus.enCoursTraitement:
        return 'in_progress';
      case IncidentStatus.enAttentePiece:
        return 'in_maintenance';
      case IncidentStatus.enAttenteValidation:
        return 'pending';
      case IncidentStatus.resolu:
        return 'resolved';
      case IncidentStatus.enAttenteRemplacement:
        return 'to_replace';
      case IncidentStatus.annule:
        return 'cancelled';
      case IncidentStatus.escalade:
        return 'escalade';
    }
  }
}

enum EquipmentType {
  fridge('Frigo'),
  table('Table'),
  chair('Chaise'),
  airConditioner('Climatiseur'),
  television('Téléviseur'),
  bed('Lit'),
  sink('Lavabo'),
  toilet('WC'),
  socket('Prise'),
  other('Autre');

  const EquipmentType(this.label);
  final String label;
}

// Classe IncidentModel selon UML
class IncidentModel {
  final String idIncident;
  final String? idEquipement;
  final String? idEspace;
  final String? idDeclarant;
  final TypeDeclarant? typeDeclarant;
  final String? idAgentResponsable;
  final IncidentStatus statut;
  final PrioriteIncident? priorite;
  final String? titre;
  final String? description;
  final String? photoPrincipale;
  final List<String>? photosSupplementaires;
  final DateTime dateDeclaration;
  final DateTime? datePriseEnCharge;
  final DateTime? dateResolution;
  final Duration? dureeResolution;
  final String? commentaireAgent;
  final String? raisonRemplacement;
  final bool necessiteValidationSuperviseur;
  final DateTime? dateValidationSuperviseur;
  final int? noteOccupant;
  final String? commentaireOccupant;

  // Champs pour compatibilité avec l'ancien système
  final String building;
  final String floor;
  final String room;
  final String? occupantId;
  final String? occupantName;
  final String? agentId;
  final String? agentName;
  final String equipmentType;

  IncidentModel({
    required this.idIncident,
    this.idEquipement,
    this.idEspace,
    this.idDeclarant,
    this.typeDeclarant,
    this.idAgentResponsable,
    required this.statut,
    this.priorite,
    this.titre,
    this.description,
    this.photoPrincipale,
    this.photosSupplementaires,
    required this.dateDeclaration,
    this.datePriseEnCharge,
    this.dateResolution,
    this.dureeResolution,
    this.commentaireAgent,
    this.raisonRemplacement,
    this.necessiteValidationSuperviseur = false,
    this.dateValidationSuperviseur,
    this.noteOccupant,
    this.commentaireOccupant,
    required this.building,
    required this.floor,
    required this.room,
    this.occupantId,
    this.occupantName,
    this.agentId,
    this.agentName,
    required this.equipmentType,
  });

  // Propriétés pour compatibilité
  String get id => idIncident;
  String get createdAt => dateDeclaration.toIso8601String();
  DateTime get createdAtDateTime => dateDeclaration;
  DateTime? get takenAt => datePriseEnCharge;
  DateTime? get resolvedAt => dateResolution;
  String? get comment => commentaireAgent;
  String? get photoUrl => photoPrincipale;
  IncidentStatus get status => statut;

  factory IncidentModel.fromJson(Map<String, dynamic> json) {
    return IncidentModel(
      idIncident: json['idIncident'] as String? ?? json['id'] as String,
      idEquipement: json['idEquipement'] as String?,
      idEspace: json['idEspace'] as String?,
      idDeclarant:
          json['idDeclarant'] as String? ?? json['occupantId'] as String?,
      typeDeclarant: json['typeDeclarant'] != null
          ? _parseTypeDeclarant(json['typeDeclarant'] as String)
          : null,
      idAgentResponsable:
          json['idAgentResponsable'] as String? ?? json['agentId'] as String?,
      statut: IncidentStatus.fromString(
          json['statut'] as String? ?? json['status'] as String?),
      priorite: json['priorite'] != null
          ? _parsePriorite(json['priorite'] as String)
          : null,
      titre: json['titre'] as String?,
      description: json['description'] as String?,
      photoPrincipale:
          json['photoPrincipale'] as String? ?? json['photoUrl'] as String?,
      photosSupplementaires: json['photosSupplementaires'] != null
          ? List<String>.from(json['photosSupplementaires'] as List)
          : null,
      dateDeclaration: json['dateDeclaration'] != null
          ? DateTime.parse(json['dateDeclaration'] as String)
          : DateTime.parse(json['createdAt'] as String),
      datePriseEnCharge: json['datePriseEnCharge'] != null
          ? DateTime.parse(json['datePriseEnCharge'] as String)
          : json['takenAt'] != null
              ? DateTime.parse(json['takenAt'] as String)
              : null,
      dateResolution: json['dateResolution'] != null
          ? DateTime.parse(json['dateResolution'] as String)
          : json['resolvedAt'] != null
              ? DateTime.parse(json['resolvedAt'] as String)
              : null,
      dureeResolution: json['dureeResolution'] != null
          ? Duration(seconds: json['dureeResolution'] as int)
          : null,
      commentaireAgent:
          json['commentaireAgent'] as String? ?? json['comment'] as String?,
      raisonRemplacement: json['raisonRemplacement'] as String?,
      necessiteValidationSuperviseur:
          json['necessiteValidationSuperviseur'] as bool? ?? false,
      dateValidationSuperviseur: json['dateValidationSuperviseur'] != null
          ? DateTime.parse(json['dateValidationSuperviseur'] as String)
          : null,
      noteOccupant: json['noteOccupant'] as int?,
      commentaireOccupant: json['commentaireOccupant'] as String?,
      building: json['building'] as String,
      floor: json['floor'] as String,
      room: json['room'] as String,
      occupantId: json['occupantId'] as String?,
      occupantName: json['occupantName'] as String?,
      agentId: json['agentId'] as String?,
      agentName: json['agentName'] as String?,
      equipmentType: json['equipmentType'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idIncident': idIncident,
      'id': idIncident, // Pour compatibilité
      'idEquipement': idEquipement,
      'idEspace': idEspace,
      'idDeclarant': idDeclarant,
      'typeDeclarant': typeDeclarant?.name,
      'idAgentResponsable': idAgentResponsable,
      'statut': statut.name,
      'status': statut.name, // Pour compatibilité
      'priorite': priorite?.name,
      'titre': titre,
      'description': description,
      'photoPrincipale': photoPrincipale,
      'photoUrl': photoPrincipale, // Pour compatibilité
      'photosSupplementaires': photosSupplementaires,
      'dateDeclaration': dateDeclaration.toIso8601String(),
      'createdAt': dateDeclaration.toIso8601String(), // Pour compatibilité
      'datePriseEnCharge': datePriseEnCharge?.toIso8601String(),
      'takenAt': datePriseEnCharge?.toIso8601String(), // Pour compatibilité
      'dateResolution': dateResolution?.toIso8601String(),
      'resolvedAt': dateResolution?.toIso8601String(), // Pour compatibilité
      'dureeResolution': dureeResolution?.inSeconds,
      'commentaireAgent': commentaireAgent,
      'comment': commentaireAgent, // Pour compatibilité
      'raisonRemplacement': raisonRemplacement,
      'necessiteValidationSuperviseur': necessiteValidationSuperviseur,
      'dateValidationSuperviseur': dateValidationSuperviseur?.toIso8601String(),
      'noteOccupant': noteOccupant,
      'commentaireOccupant': commentaireOccupant,
      'building': building,
      'floor': floor,
      'room': room,
      'occupantId': occupantId,
      'occupantName': occupantName,
      'agentId': agentId,
      'agentName': agentName,
      'equipmentType': equipmentType,
    };
  }

  IncidentModel copyWith({
    String? idIncident,
    String? idEquipement,
    String? idEspace,
    String? idDeclarant,
    TypeDeclarant? typeDeclarant,
    String? idAgentResponsable,
    IncidentStatus? statut,
    PrioriteIncident? priorite,
    String? titre,
    String? description,
    String? photoPrincipale,
    List<String>? photosSupplementaires,
    DateTime? dateDeclaration,
    DateTime? datePriseEnCharge,
    DateTime? dateResolution,
    Duration? dureeResolution,
    String? commentaireAgent,
    String? raisonRemplacement,
    bool? necessiteValidationSuperviseur,
    DateTime? dateValidationSuperviseur,
    int? noteOccupant,
    String? commentaireOccupant,
    String? building,
    String? floor,
    String? room,
    String? occupantId,
    String? occupantName,
    String? agentId,
    String? agentName,
    String? equipmentType,
  }) {
    return IncidentModel(
      idIncident: idIncident ?? this.idIncident,
      idEquipement: idEquipement ?? this.idEquipement,
      idEspace: idEspace ?? this.idEspace,
      idDeclarant: idDeclarant ?? this.idDeclarant,
      typeDeclarant: typeDeclarant ?? this.typeDeclarant,
      idAgentResponsable: idAgentResponsable ?? this.idAgentResponsable,
      statut: statut ?? this.statut,
      priorite: priorite ?? this.priorite,
      titre: titre ?? this.titre,
      description: description ?? this.description,
      photoPrincipale: photoPrincipale ?? this.photoPrincipale,
      photosSupplementaires:
          photosSupplementaires ?? this.photosSupplementaires,
      dateDeclaration: dateDeclaration ?? this.dateDeclaration,
      datePriseEnCharge: datePriseEnCharge ?? this.datePriseEnCharge,
      dateResolution: dateResolution ?? this.dateResolution,
      dureeResolution: dureeResolution ?? this.dureeResolution,
      commentaireAgent: commentaireAgent ?? this.commentaireAgent,
      raisonRemplacement: raisonRemplacement ?? this.raisonRemplacement,
      necessiteValidationSuperviseur:
          necessiteValidationSuperviseur ?? this.necessiteValidationSuperviseur,
      dateValidationSuperviseur:
          dateValidationSuperviseur ?? this.dateValidationSuperviseur,
      noteOccupant: noteOccupant ?? this.noteOccupant,
      commentaireOccupant: commentaireOccupant ?? this.commentaireOccupant,
      building: building ?? this.building,
      floor: floor ?? this.floor,
      room: room ?? this.room,
      occupantId: occupantId ?? this.occupantId,
      occupantName: occupantName ?? this.occupantName,
      agentId: agentId ?? this.agentId,
      agentName: agentName ?? this.agentName,
      equipmentType: equipmentType ?? this.equipmentType,
    );
  }

  static TypeDeclarant _parseTypeDeclarant(String value) {
    switch (value.toLowerCase()) {
      case 'occupant':
        return TypeDeclarant.occupant;
      case 'agent_terrain':
      case 'agent':
        return TypeDeclarant.agentTerrain;
      default:
        return TypeDeclarant.occupant;
    }
  }

  static PrioriteIncident _parsePriorite(String value) {
    switch (value.toLowerCase()) {
      case 'critique':
        return PrioriteIncident.critique;
      case 'haute':
        return PrioriteIncident.haute;
      case 'moyenne':
        return PrioriteIncident.moyenne;
      case 'basse':
        return PrioriteIncident.basse;
      default:
        return PrioriteIncident.moyenne;
    }
  }
}
