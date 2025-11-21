// Enums selon les diagrammes UML
enum TypeBatiment {
  pedagogique('Pédagogique'),
  administratif('Administratif'),
  citeUniversitaire('Cité Universitaire'),
  residencePersonnel('Résidence Personnel'),
  mixte('Mixte');

  const TypeBatiment(this.label);
  final String label;
}

enum TypeEspace {
  chambreSimple('Chambre Simple'),
  chambreDouble('Chambre Double'),
  chambreTriple('Chambre Triple'),
  salleClasse('Salle de classe'),
  amphitheatre('Amphithéâtre'),
  bureauIndividuel('Bureau Individuel'),
  bureauPartage('Bureau Partagé'),
  laboratoire('Laboratoire'),
  salleReunion('Salle de réunion'),
  autre('Autre');

  const TypeEspace(this.label);
  final String label;
}

enum StatutEquipement {
  bonEtat('Bon état'),
  aReparer('À réparer'),
  aRemplacer('À remplacer'),
  enMaintenance('En maintenance'),
  horsService('Hors service'),
  enAttentePiece('En attente');

  const StatutEquipement(this.label);
  final String label;
}

enum TypeEquipement {
  lit('Lit'),
  table('Table'),
  chaise('Chaise'),
  armoire('Armoire'),
  climatiseur('Climatiseur'),
  refrigerateur('Réfrigérateur'),
  televiseur('Téléviseur'),
  bureau('Bureau'),
  etagere('Étagère'),
  lavabo('Lavabo'),
  wc('WC'),
  douche('Douche'),
  porte('Porte'),
  fenetre('Fenêtre'),
  priseElectrique('Prise électrique'),
  lampe('Lampe'),
  tableauBlanc('Tableau blanc'),
  projecteur('Projecteur'),
  autre('Autre');

  const TypeEquipement(this.label);
  final String label;
}

// Classe Coordonnees selon UML
class Coordonnees {
  final double latitude;
  final double longitude;
  final double? altitude;

  Coordonnees({
    required this.latitude,
    required this.longitude,
    this.altitude,
  });

  factory Coordonnees.fromJson(Map<String, dynamic> json) {
    return Coordonnees(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      altitude: json['altitude'] != null
          ? (json['altitude'] as num).toDouble()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
      if (altitude != null) 'altitude': altitude,
    };
  }
}

// Classe BuildingModel selon UML
class BuildingModel {
  final String idBatiment;
  final String nom;
  final String? code;
  final TypeBatiment typeBatiment;
  final String? adresse;
  final Coordonnees? coordonneesGPS;
  final int nombreEtages;
  final double? superficie;
  final DateTime? dateConstruction;
  final String? description;
  final String? planBatiment;
  final DateTime dateCreation;
  final DateTime? dateModification;
  final List<FloorModel> floors;

  BuildingModel({
    required this.idBatiment,
    required this.nom,
    this.code,
    required this.typeBatiment,
    this.adresse,
    this.coordonneesGPS,
    required this.nombreEtages,
    this.superficie,
    this.dateConstruction,
    this.description,
    this.planBatiment,
    required this.dateCreation,
    this.dateModification,
    required this.floors,
  });

  // Propriété pour compatibilité
  String get id => idBatiment;
  String get name => nom;
  String get site => adresse ?? 'Non spécifié';

  factory BuildingModel.fromJson(Map<String, dynamic> json) {
    return BuildingModel(
      idBatiment: json['idBatiment'] as String? ?? json['id'] as String,
      nom: json['nom'] as String? ?? json['name'] as String,
      code: json['code'] as String?,
      typeBatiment: _parseTypeBatiment(
          json['typeBatiment'] as String? ?? json['type'] as String?),
      adresse: json['adresse'] as String?,
      coordonneesGPS: json['coordonneesGPS'] != null
          ? Coordonnees.fromJson(json['coordonneesGPS'] as Map<String, dynamic>)
          : null,
      nombreEtages: json['nombreEtages'] as int? ??
          (json['floors'] as List?)?.length ??
          0,
      superficie: json['superficie'] != null
          ? (json['superficie'] as num).toDouble()
          : null,
      dateConstruction: json['dateConstruction'] != null
          ? DateTime.parse(json['dateConstruction'] as String)
          : null,
      description: json['description'] as String?,
      planBatiment: json['planBatiment'] as String?,
      dateCreation: json['dateCreation'] != null
          ? DateTime.parse(json['dateCreation'] as String)
          : DateTime.now(),
      dateModification: json['dateModification'] != null
          ? DateTime.parse(json['dateModification'] as String)
          : null,
      floors: (json['floors'] as List<dynamic>?)
              ?.map((f) => FloorModel.fromJson(f as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idBatiment': idBatiment,
      'id': idBatiment, // Pour compatibilité
      'nom': nom,
      'name': nom, // Pour compatibilité
      'code': code,
      'typeBatiment': typeBatiment.name,
      'type': typeBatiment.name, // Pour compatibilité
      'adresse': adresse,
      'coordonneesGPS': coordonneesGPS?.toJson(),
      'nombreEtages': nombreEtages,
      'superficie': superficie,
      'dateConstruction': dateConstruction?.toIso8601String(),
      'description': description,
      'planBatiment': planBatiment,
      'dateCreation': dateCreation.toIso8601String(),
      'dateModification': dateModification?.toIso8601String(),
      'floors': floors.map((f) => f.toJson()).toList(),
      'site': adresse ?? 'Non spécifié', // Pour compatibilité
    };
  }

  static TypeBatiment _parseTypeBatiment(String? value) {
    if (value == null) return TypeBatiment.pedagogique;
    switch (value.toLowerCase()) {
      case 'pedagogique':
        return TypeBatiment.pedagogique;
      case 'administratif':
        return TypeBatiment.administratif;
      case 'cite_universitaire':
      case 'cite':
        return TypeBatiment.citeUniversitaire;
      case 'residence_personnel':
        return TypeBatiment.residencePersonnel;
      case 'mixte':
        return TypeBatiment.mixte;
      default:
        return TypeBatiment.pedagogique;
    }
  }
}

// Classe FloorModel selon UML
class FloorModel {
  final String idEtage;
  final String idBatiment;
  final int numeroEtage;
  final String designation;
  final double? superficie;
  final int nombreEspaces;
  final String? planEtage;
  final DateTime dateCreation;
  final List<RoomModel> rooms;

  FloorModel({
    required this.idEtage,
    required this.idBatiment,
    required this.numeroEtage,
    required this.designation,
    this.superficie,
    required this.nombreEspaces,
    this.planEtage,
    required this.dateCreation,
    required this.rooms,
  });

  // Propriétés pour compatibilité
  String get id => idEtage;
  String get number => designation;

  factory FloorModel.fromJson(Map<String, dynamic> json) {
    return FloorModel(
      idEtage: json['idEtage'] as String? ?? json['id'] as String,
      idBatiment: json['idBatiment'] as String? ?? '',
      numeroEtage: json['numeroEtage'] as int? ??
          _extractFloorNumber(json['number'] as String? ?? ''),
      designation: json['designation'] as String? ?? json['number'] as String,
      superficie: json['superficie'] != null
          ? (json['superficie'] as num).toDouble()
          : null,
      nombreEspaces: json['nombreEspaces'] as int? ??
          (json['rooms'] as List?)?.length ??
          0,
      planEtage: json['planEtage'] as String?,
      dateCreation: json['dateCreation'] != null
          ? DateTime.parse(json['dateCreation'] as String)
          : DateTime.now(),
      rooms: (json['rooms'] as List<dynamic>?)
              ?.map((r) => RoomModel.fromJson(r as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idEtage': idEtage,
      'id': idEtage, // Pour compatibilité
      'idBatiment': idBatiment,
      'numeroEtage': numeroEtage,
      'designation': designation,
      'number': designation, // Pour compatibilité
      'superficie': superficie,
      'nombreEspaces': nombreEspaces,
      'planEtage': planEtage,
      'dateCreation': dateCreation.toIso8601String(),
      'rooms': rooms.map((r) => r.toJson()).toList(),
    };
  }

  static int _extractFloorNumber(String floorStr) {
    final match = RegExp(r'(\d+)').firstMatch(floorStr);
    return match != null ? int.parse(match.group(1)!) : 1;
  }
}

// Classe RoomModel (Espace) selon UML
class RoomModel {
  final String idEspace;
  final String idEtage;
  final String numero;
  final TypeEspace typeEspace;
  final double? superficie;
  final int? capaciteOccupation;
  final String? description;
  final bool estOccupe;
  final bool aEquipementDefectueux;
  final DateTime dateCreation;
  final DateTime? dateModification;
  final List<EquipmentModel> equipment;

  RoomModel({
    required this.idEspace,
    required this.idEtage,
    required this.numero,
    required this.typeEspace,
    this.superficie,
    this.capaciteOccupation,
    this.description,
    this.estOccupe = false,
    this.aEquipementDefectueux = false,
    required this.dateCreation,
    this.dateModification,
    required this.equipment,
  });

  // Propriétés pour compatibilité
  String get id => idEspace;
  String get number => numero;
  String get name => numero;
  String get type => typeEspace.label;

  factory RoomModel.fromJson(Map<String, dynamic> json) {
    return RoomModel(
      idEspace: json['idEspace'] as String? ?? json['id'] as String,
      idEtage: json['idEtage'] as String? ?? '',
      numero: json['numero'] as String? ?? json['number'] as String,
      typeEspace: _parseTypeEspace(
          json['typeEspace'] as String? ?? json['type'] as String?),
      superficie: json['superficie'] != null
          ? (json['superficie'] as num).toDouble()
          : null,
      capaciteOccupation: json['capaciteOccupation'] as int?,
      description: json['description'] as String?,
      estOccupe: json['estOccupe'] as bool? ?? false,
      aEquipementDefectueux: json['aEquipementDefectueux'] as bool? ?? false,
      dateCreation: json['dateCreation'] != null
          ? DateTime.parse(json['dateCreation'] as String)
          : DateTime.now(),
      dateModification: json['dateModification'] != null
          ? DateTime.parse(json['dateModification'] as String)
          : null,
      equipment: (json['equipment'] as List<dynamic>?)
              ?.map((e) => EquipmentModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idEspace': idEspace,
      'id': idEspace, // Pour compatibilité
      'idEtage': idEtage,
      'numero': numero,
      'number': numero, // Pour compatibilité
      'typeEspace': typeEspace.name,
      'type': typeEspace.name, // Pour compatibilité
      'superficie': superficie,
      'capaciteOccupation': capaciteOccupation,
      'description': description,
      'estOccupe': estOccupe,
      'aEquipementDefectueux': aEquipementDefectueux,
      'dateCreation': dateCreation.toIso8601String(),
      'dateModification': dateModification?.toIso8601String(),
      'equipment': equipment.map((e) => e.toJson()).toList(),
      'name': numero, // Pour compatibilité
    };
  }

  static TypeEspace _parseTypeEspace(String? value) {
    if (value == null) return TypeEspace.autre;
    switch (value.toLowerCase()) {
      case 'chambre':
      case 'chambre_simple':
        return TypeEspace.chambreSimple;
      case 'chambre_double':
        return TypeEspace.chambreDouble;
      case 'chambre_triple':
        return TypeEspace.chambreTriple;
      case 'salle':
      case 'salle_classe':
      case 'salle de classe':
        return TypeEspace.salleClasse;
      case 'amphitheatre':
        return TypeEspace.amphitheatre;
      case 'bureau':
      case 'bureau_individuel':
        return TypeEspace.bureauIndividuel;
      case 'bureau_partage':
        return TypeEspace.bureauPartage;
      case 'laboratoire':
        return TypeEspace.laboratoire;
      case 'salle_reunion':
        return TypeEspace.salleReunion;
      default:
        return TypeEspace.autre;
    }
  }
}

// Classe EquipmentModel selon UML
class EquipmentModel {
  final String idEquipement;
  final TypeEquipement typeEquipement;
  final String? marque;
  final String? modele;
  final String? numeroSerie;
  final StatutEquipement statut;
  final String? idEspaceActuel;
  final DateTime? dateAcquisition;
  final double? valeurAchat;
  final int? dureeVieEstimee;
  final String? description;
  final DateTime dateCreation;
  final DateTime? dateModification;
  final int historiquePannes;
  final DateTime? derniereDatePanne;

  EquipmentModel({
    required this.idEquipement,
    required this.typeEquipement,
    this.marque,
    this.modele,
    this.numeroSerie,
    required this.statut,
    this.idEspaceActuel,
    this.dateAcquisition,
    this.valeurAchat,
    this.dureeVieEstimee,
    this.description,
    required this.dateCreation,
    this.dateModification,
    this.historiquePannes = 0,
    this.derniereDatePanne,
  });

  // Propriétés pour compatibilité
  String get id => idEquipement;
  String get type => typeEquipement.label;
  String get status => statut.label;
  DateTime? get lastCheck => dateModification;

  factory EquipmentModel.fromJson(Map<String, dynamic> json) {
    return EquipmentModel(
      idEquipement: json['idEquipement'] as String? ?? json['id'] as String,
      typeEquipement: _parseTypeEquipement(
          json['typeEquipement'] as String? ?? json['type'] as String?),
      marque: json['marque'] as String?,
      modele: json['modele'] as String?,
      numeroSerie: json['numeroSerie'] as String?,
      statut: _parseStatutEquipement(
          json['statut'] as String? ?? json['status'] as String?),
      idEspaceActuel: json['idEspaceActuel'] as String?,
      dateAcquisition: json['dateAcquisition'] != null
          ? DateTime.parse(json['dateAcquisition'] as String)
          : null,
      valeurAchat: json['valeurAchat'] != null
          ? (json['valeurAchat'] as num).toDouble()
          : null,
      dureeVieEstimee: json['dureeVieEstimee'] as int?,
      description: json['description'] as String?,
      dateCreation: json['dateCreation'] != null
          ? DateTime.parse(json['dateCreation'] as String)
          : DateTime.now(),
      dateModification: json['dateModification'] != null
          ? DateTime.parse(json['dateModification'] as String)
          : json['lastCheck'] != null
              ? DateTime.parse(json['lastCheck'] as String)
              : null,
      historiquePannes: json['historiquePannes'] as int? ?? 0,
      derniereDatePanne: json['derniereDatePanne'] != null
          ? DateTime.parse(json['derniereDatePanne'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idEquipement': idEquipement,
      'id': idEquipement, // Pour compatibilité
      'typeEquipement': typeEquipement.name,
      'type': typeEquipement.label, // Pour compatibilité
      'marque': marque,
      'modele': modele,
      'numeroSerie': numeroSerie,
      'statut': statut.name,
      'status': statut.label, // Pour compatibilité
      'idEspaceActuel': idEspaceActuel,
      'dateAcquisition': dateAcquisition?.toIso8601String(),
      'valeurAchat': valeurAchat,
      'dureeVieEstimee': dureeVieEstimee,
      'description': description,
      'dateCreation': dateCreation.toIso8601String(),
      'dateModification': dateModification?.toIso8601String(),
      'lastCheck': dateModification?.toIso8601String(), // Pour compatibilité
      'historiquePannes': historiquePannes,
      'derniereDatePanne': derniereDatePanne?.toIso8601String(),
    };
  }

  static TypeEquipement _parseTypeEquipement(String? value) {
    if (value == null) return TypeEquipement.autre;
    switch (value.toLowerCase()) {
      case 'lit':
        return TypeEquipement.lit;
      case 'table':
        return TypeEquipement.table;
      case 'chaise':
        return TypeEquipement.chaise;
      case 'armoire':
        return TypeEquipement.armoire;
      case 'climatiseur':
      case 'climatisation':
        return TypeEquipement.climatiseur;
      case 'refrigerateur':
      case 'frigo':
        return TypeEquipement.refrigerateur;
      case 'televiseur':
      case 'téléviseur':
        return TypeEquipement.televiseur;
      case 'bureau':
        return TypeEquipement.bureau;
      case 'etagere':
        return TypeEquipement.etagere;
      case 'lavabo':
        return TypeEquipement.lavabo;
      case 'wc':
        return TypeEquipement.wc;
      case 'douche':
        return TypeEquipement.douche;
      case 'porte':
        return TypeEquipement.porte;
      case 'fenetre':
      case 'fenêtre':
        return TypeEquipement.fenetre;
      case 'prise':
      case 'prise_electrique':
        return TypeEquipement.priseElectrique;
      case 'lampe':
        return TypeEquipement.lampe;
      case 'tableau':
      case 'tableau_blanc':
        return TypeEquipement.tableauBlanc;
      case 'projecteur':
        return TypeEquipement.projecteur;
      default:
        return TypeEquipement.autre;
    }
  }

  static StatutEquipement _parseStatutEquipement(String? value) {
    if (value == null) return StatutEquipement.bonEtat;
    switch (value.toLowerCase()) {
      case 'bon état':
      case 'bon_etat':
        return StatutEquipement.bonEtat;
      case 'à réparer':
      case 'a_reparer':
        return StatutEquipement.aReparer;
      case 'à remplacer':
      case 'a_remplacer':
        return StatutEquipement.aRemplacer;
      case 'en maintenance':
      case 'en_maintenance':
        return StatutEquipement.enMaintenance;
      case 'hors service':
      case 'hors_service':
        return StatutEquipement.horsService;
      case 'en attente pièce':
      case 'en_attente_piece':
        return StatutEquipement.enAttentePiece;
      default:
        return StatutEquipement.bonEtat;
    }
  }
}
