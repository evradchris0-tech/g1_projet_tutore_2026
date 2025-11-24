import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../widgets/back_button_app_bar.dart';
import '../../core/services/api_service.dart';
import '../../models/user_model.dart';
import '../../core/utils/haptic_feedback_util.dart';

class AgentCreateAgentScreen extends StatefulWidget {
  const AgentCreateAgentScreen({super.key});

  @override
  State<AgentCreateAgentScreen> createState() => _AgentCreateAgentScreenState();
}

class _AgentCreateAgentScreenState extends State<AgentCreateAgentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nomController = TextEditingController();
  final _prenomController = TextEditingController();
  final _emailController = TextEditingController();
  final _telephoneController = TextEditingController();
  final _pseudoController = TextEditingController();
  final _motDePasseController = TextEditingController();
  final _confirmationMotDePasseController = TextEditingController();

  SpecialiteAgent? _selectedSpecialite;
  bool _estSuperviseur = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _nomController.dispose();
    _prenomController.dispose();
    _emailController.dispose();
    _telephoneController.dispose();
    _pseudoController.dispose();
    _motDePasseController.dispose();
    _confirmationMotDePasseController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final agentData = {
        'nom': _nomController.text.trim(),
        'prenom': _prenomController.text.trim(),
        'email': _emailController.text.trim(),
        'telephone': _telephoneController.text.trim(),
        'pseudo': _pseudoController.text.trim().isEmpty
            ? null
            : _pseudoController.text.trim(),
        'motDePasse': _motDePasseController.text,
        'specialite': _selectedSpecialite?.name,
        'estSuperviseur': _estSuperviseur,
        'typeUtilisateur': 'agent_terrain',
        'statut': 'actif',
        'dateCreation': DateTime.now().toIso8601String(),
      };

      await ApiService.createAgent(agentData);

      if (mounted) {
        HapticFeedbackUtil.success();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Agent créé avec succès'),
            backgroundColor: AppTheme.successColor,
          ),
        );
        context.pop(true); // Retour avec succès
      }
    } catch (e) {
      if (mounted) {
        HapticFeedbackUtil.error();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors de la création: ${e.toString()}'),
            backgroundColor: AppTheme.dangerColor,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: BackButtonAppBar(title: 'Créer un agent'),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppConstants.spacingMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Informations personnelles
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.spacingMd),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Informations personnelles',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Nom
                      TextFormField(
                        controller: _nomController,
                        decoration: const InputDecoration(
                          labelText: 'Nom *',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez saisir le nom';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Prénom
                      TextFormField(
                        controller: _prenomController,
                        decoration: const InputDecoration(
                          labelText: 'Prénom *',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez saisir le prénom';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Email
                      TextFormField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email *',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez saisir l\'email';
                          }
                          if (!value.contains('@')) {
                            return 'Email invalide';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Téléphone
                      TextFormField(
                        controller: _telephoneController,
                        decoration: const InputDecoration(
                          labelText: 'Téléphone',
                          border: OutlineInputBorder(),
                          hintText: '+237 6XX XXX XXX',
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Pseudo
                      TextFormField(
                        controller: _pseudoController,
                        decoration: const InputDecoration(
                          labelText: 'Pseudo (optionnel)',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Informations professionnelles
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.spacingMd),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Informations professionnelles',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Spécialité
                      DropdownButtonFormField<SpecialiteAgent>(
                        value: _selectedSpecialite,
                        decoration: const InputDecoration(
                          labelText: 'Spécialité',
                          border: OutlineInputBorder(),
                        ),
                        items: SpecialiteAgent.values.map((specialite) {
                          return DropdownMenuItem(
                            value: specialite,
                            child: Text(specialite.label),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedSpecialite = value;
                          });
                        },
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Superviseur
                      SwitchListTile(
                        title: const Text('Superviseur'),
                        subtitle: const Text(
                          'Accorder les droits de superviseur à cet agent',
                        ),
                        value: _estSuperviseur,
                        onChanged: (value) {
                          setState(() {
                            _estSuperviseur = value;
                          });
                        },
                        activeColor: AppTheme.primaryColor,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppConstants.spacingMd),

              // Mot de passe
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.spacingMd),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Mot de passe',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Mot de passe
                      TextFormField(
                        controller: _motDePasseController,
                        decoration: const InputDecoration(
                          labelText: 'Mot de passe *',
                          border: OutlineInputBorder(),
                        ),
                        obscureText: true,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez saisir un mot de passe';
                          }
                          if (value.length < 6) {
                            return 'Le mot de passe doit contenir au moins 6 caractères';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppConstants.spacingMd),
                      // Confirmation mot de passe
                      TextFormField(
                        controller: _confirmationMotDePasseController,
                        decoration: const InputDecoration(
                          labelText: 'Confirmer le mot de passe *',
                          border: OutlineInputBorder(),
                        ),
                        obscureText: true,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Veuillez confirmer le mot de passe';
                          }
                          if (value != _motDePasseController.text) {
                            return 'Les mots de passe ne correspondent pas';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppConstants.spacingXl),

              // Bouton Enregistrer
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      vertical: AppConstants.spacingMd,
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Créer l\'agent'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}











