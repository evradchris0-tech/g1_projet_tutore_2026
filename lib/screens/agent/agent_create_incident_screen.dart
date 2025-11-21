import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';
import '../../core/services/api_service.dart';

class AgentCreateIncidentScreen extends StatefulWidget {
  const AgentCreateIncidentScreen({super.key});

  @override
  State<AgentCreateIncidentScreen> createState() =>
      _AgentCreateIncidentScreenState();
}

class _AgentCreateIncidentScreenState extends State<AgentCreateIncidentScreen> {
  final _formKey = GlobalKey<FormState>();
  String? _selectedSpaceType;
  String? _selectedBuilding;
  String? _selectedFloor;
  String? _selectedRoom;
  String? _selectedEquipment;
  String? _selectedStatus;
  final _commentController = TextEditingController();

  final List<String> _spaceTypes = [
    'Chambre',
    'Salle de classe',
    'Bureau',
    'Salle Dkr',
    'Autre',
  ];

  final List<String> _buildings = [
    'Bâtiment Pédagogique A',
    'Bâtiment Pédagogique B',
    'Cité Universitaire',
    'Bâtiment des Pères',
  ];

  final List<String> _floors = [
    '1er étage',
    '2ème étage',
    '3ème étage',
    '4ème étage',
  ];

  final List<String> _equipmentTypes = [
    'Frigo',
    'Table',
    'Chaise',
    'Climatiseur',
    'Téléviseur',
    'Lit',
    'Lavabo',
    'WC',
    'Prise',
    'Autre',
  ];

  final List<String> _statuses = [
    'Bon état',
    'À réparer',
    'À remplacer',
    'En maintenance',
  ];

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    try {
      // Préparer les données pour l'API
      final incidentData = {
        'equipmentType': _selectedEquipment!,
        'description':
            _commentController.text.isNotEmpty ? _commentController.text : null,
        'status': _getStatusFromString(_selectedStatus!),
        'building': _selectedBuilding!,
        'floor': _selectedFloor!,
        'room': _selectedRoom!,
        'createdAt': DateTime.now().toIso8601String(),
      };

      await ApiService.createIncident(incidentData);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Incident enregistré avec succès'),
            backgroundColor: AppTheme.successColor,
          ),
        );
        context.go('/agent-dashboard');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors de l\'enregistrement: ${e.toString()}'),
            backgroundColor: AppTheme.dangerColor,
          ),
        );
      }
    }
  }

  String _getStatusFromString(String status) {
    switch (status) {
      case 'Bon état':
        return 'good_condition';
      case 'À réparer':
        return 'pending';
      case 'À remplacer':
        return 'to_replace';
      case 'En maintenance':
        return 'in_maintenance';
      default:
        return 'pending';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(title: 'Créer un incident'),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppConstants.spacingMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Type d'espace
              DropdownButtonFormField<String>(
                value: _selectedSpaceType,
                decoration: const InputDecoration(
                  labelText: 'Type d\'espace',
                  border: OutlineInputBorder(),
                ),
                items: _spaceTypes.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedSpaceType = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner un type d\'espace';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Bâtiment
              DropdownButtonFormField<String>(
                value: _selectedBuilding,
                decoration: const InputDecoration(
                  labelText: 'Bâtiment',
                  border: OutlineInputBorder(),
                ),
                items: _buildings.map((building) {
                  return DropdownMenuItem(
                    value: building,
                    child: Text(building),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedBuilding = value;
                    _selectedFloor = null;
                    _selectedRoom = null;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner un bâtiment';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Étage
              if (_selectedBuilding != null)
                DropdownButtonFormField<String>(
                  value: _selectedFloor,
                  decoration: const InputDecoration(
                    labelText: 'Étage',
                    border: OutlineInputBorder(),
                  ),
                  items: _floors.map((floor) {
                    return DropdownMenuItem(
                      value: floor,
                      child: Text(floor),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedFloor = value;
                      _selectedRoom = null;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez sélectionner un étage';
                    }
                    return null;
                  },
                ),
              if (_selectedBuilding != null)
                const SizedBox(height: AppConstants.spacingMd),

              // Chambre/Salle/Bureau
              if (_selectedFloor != null)
                DropdownButtonFormField<String>(
                  value: _selectedRoom,
                  decoration: const InputDecoration(
                    labelText: 'Chambre/Salle/Bureau',
                    border: OutlineInputBorder(),
                  ),
                  items: List.generate(10, (index) {
                    return DropdownMenuItem(
                      value: '${205 + index}',
                      child: Text('${205 + index}'),
                    );
                  }),
                  onChanged: (value) {
                    setState(() {
                      _selectedRoom = value;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez sélectionner une chambre/salle/bureau';
                    }
                    return null;
                  },
                ),
              if (_selectedFloor != null)
                const SizedBox(height: AppConstants.spacingMd),

              // Équipement
              DropdownButtonFormField<String>(
                value: _selectedEquipment,
                decoration: const InputDecoration(
                  labelText: 'Équipement',
                  border: OutlineInputBorder(),
                ),
                items: _equipmentTypes.map((equipment) {
                  return DropdownMenuItem(
                    value: equipment,
                    child: Text(equipment),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedEquipment = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner un équipement';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Statut
              DropdownButtonFormField<String>(
                value: _selectedStatus,
                decoration: const InputDecoration(
                  labelText: 'Statut',
                  border: OutlineInputBorder(),
                ),
                items: _statuses.map((status) {
                  return DropdownMenuItem(
                    value: status,
                    child: Text(status),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedStatus = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner un statut';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Commentaire
              TextFormField(
                controller: _commentController,
                decoration: const InputDecoration(
                  labelText: 'Commentaire',
                  hintText: 'Ajouter un commentaire...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 4,
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Photo (optionnelle)
              Card(
                child: InkWell(
                  onTap: () {
                    // TODO: Prendre une photo
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Fonctionnalité photo à implémenter'),
                      ),
                    );
                  },
                  borderRadius:
                      BorderRadius.circular(AppConstants.borderRadius),
                  child: Container(
                    padding: const EdgeInsets.all(AppConstants.spacingXl),
                    child: Column(
                      children: [
                        Icon(
                          Icons.camera_alt_outlined,
                          size: 48,
                          color: AppTheme.gray400,
                        ),
                        const SizedBox(height: AppConstants.spacingSm),
                        Text(
                          'Optionnel: Ajouter une photo',
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(color: AppTheme.gray600),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppConstants.spacingXl),

              // Bouton Enregistrer
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      vertical: AppConstants.spacingMd,
                    ),
                  ),
                  child: const Text('Enregistrer l\'incident'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
