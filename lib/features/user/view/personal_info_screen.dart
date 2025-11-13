import 'package:flutter/material.dart';
import '../viewmodel/auth_viewmodel.dart';

class PersonalInfoScreen extends StatelessWidget {
  const PersonalInfoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = AuthViewModel.instance.user.value;
    final displayName = user?.username ?? '-';
    String email;
    if (user == null) {
      email = '-';
    } else {
      final uname = user.username.replaceAll(' ', '.').toLowerCase();
      email = '$uname@saintjeaningenieur.org';
    }

    // Placeholder values for phone and address — replace with real data when available
    const phone = '(237) 656-67-19-22';
    const primaryAddress = 'ch301 -yaoundé-eyang';

    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Personal Info'),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Stack(
                  children: [
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: Colors.grey[200],
                        image: null,
                      ),
                      child: Center(
                        child: Text(
                          displayName.isNotEmpty ? displayName[0].toUpperCase() : '-',
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: Colors.green,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(Icons.add, size: 18, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              const Text('Full name', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextFormField(
                initialValue: displayName,
                readOnly: true,
                decoration: InputDecoration(
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                ),
              ),

              const SizedBox(height: 16),
              const Text('Email', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextFormField(
                initialValue: email,
                readOnly: true,
                decoration: InputDecoration(
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                ),
              ),

              const SizedBox(height: 16),
              const Text('Phone number', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextFormField(
                initialValue: phone,
                readOnly: true,
                decoration: InputDecoration(
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                ),
              ),

              const SizedBox(height: 24),
              const Text('Primary address', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      primaryAddress,
                      style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      // TODO: edit address
                    },
                    icon: Icon(Icons.edit_outlined, color: theme.primaryColor),
                  ),
                ],
              ),

              const SizedBox(height: 12),
              TextButton.icon(
                onPressed: () {
                  // TODO: add address
                },
                icon: Icon(Icons.add_circle_outline, color: theme.primaryColor),
                label: Text('Add new address', style: TextStyle(color: theme.primaryColor)),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
