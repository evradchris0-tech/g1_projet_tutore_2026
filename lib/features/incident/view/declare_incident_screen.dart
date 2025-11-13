import 'package:flutter/material.dart';

class DeclareIncidentScreen extends StatefulWidget {
  const DeclareIncidentScreen({super.key});

  @override
  State<DeclareIncidentScreen> createState() => _DeclareIncidentScreenState();
}

class _DeclareIncidentScreenState extends State<DeclareIncidentScreen> {
  final _formKey = GlobalKey<FormState>();

  String? _spaceType;
  String? _building;
  String? _floor;
  String? _spaceNumber;
  String? _equipment;
  String? _status;
  final _commentController = TextEditingController();

  final _spaceTypes = ['Chambre', 'Bureau', 'Salle', 'Autre'];
  final _buildings = ['Batiment A', 'Batiment B', 'Batiment C'];
  final _floors = ['RDC', '1', '2', '3'];
  final _spaceNumbers = ['CH101', 'CH201', 'CH301'];
  final _equipments = ['Fridge', 'Socket', 'AC', 'Door'];
  final _statuses = ['To replace', 'To repair', 'Good condition'];

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    // For now just pop with a snackbar confirmation
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Incident saved (hard-coded)')));
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
      borderSide: BorderSide(color: Colors.grey.shade300),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Déclarer un incident'),
        elevation: 0,
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),

                const Text('Type d\'espace', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _spaceType,
                  items: _spaceTypes.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => _spaceType = v),
                  decoration: InputDecoration(border: border, enabledBorder: border, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),

                const SizedBox(height: 16),
                const Text('Batiment', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _building,
                  items: _buildings.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => _building = v),
                  decoration: InputDecoration(border: border, enabledBorder: border, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),

                const SizedBox(height: 16),
                const Text('Etage', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _floor,
                  items: _floors.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => _floor = v),
                  decoration: InputDecoration(border: border, enabledBorder: border, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),

                const SizedBox(height: 16),
                const Text('Number space', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _spaceNumber,
                  items: _spaceNumbers.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => _spaceNumber = v),
                  decoration: InputDecoration(border: border, enabledBorder: border, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),

                const SizedBox(height: 16),
                const Text('Equipment', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _equipment,
                  items: _equipments.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => _equipment = v),
                  decoration: InputDecoration(border: border, enabledBorder: border, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),

                const SizedBox(height: 16),
                const Text('Status', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _status,
                  items: _statuses.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setState(() => _status = v),
                  decoration: InputDecoration(border: border, enabledBorder: border, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),

                const SizedBox(height: 16),
                const Text('Comment', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _commentController,
                  minLines: 4,
                  maxLines: 8,
                  decoration: InputDecoration(
                    border: border,
                    enabledBorder: border,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 18),
                  ),
                ),

                const SizedBox(height: 12),
                // camera icon aligned to the right similar to the mock
                Align(
                  alignment: Alignment.centerRight,
                  child: IconButton(
                    onPressed: () {
                      // TODO: open camera / image picker
                    },
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.camera_alt, color: Colors.white),
                    ),
                    iconSize: 40,
                  ),
                ),

                const SizedBox(height: 18),

                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _save,
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2B6AF7), padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                        child: const Text('Save'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                        child: const Text('Cancel'),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
