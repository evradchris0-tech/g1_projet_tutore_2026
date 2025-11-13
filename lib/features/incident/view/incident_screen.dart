import 'package:flutter/material.dart';
import 'declare_incident_screen.dart';

class IncidentScreen extends StatelessWidget {
  const IncidentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final headerColor = const Color(0xFF1E40AF); // deep blue

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: Colors.grey[100],
        body: Column(
          children: [
            // Blue header with title and search
            Container(
              color: headerColor,
              padding: const EdgeInsets.fromLTRB(16, 36, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Incidents',
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 12),
                  // search box
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'What do you need help with',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        prefixIcon: const Icon(Icons.search, color: Colors.grey),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Tabs
            Container(
              color: Colors.white,
              child: TabBar(
                labelColor: Colors.black87,
                unselectedLabelColor: Colors.grey[600],
                indicatorColor: headerColor,
                tabs: const [
                  Tab(text: 'All'),
                  Tab(text: 'Pending'),
                  Tab(text: 'Resolved'),
                ],
              ),
            ),

            // Tab views
            Expanded(
              child: TabBarView(
                children: [
                  _IncidentList(section: 'All'),
                  _IncidentList(section: 'Pending'),
                  _IncidentList(section: 'Resolved'),
                ],
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const DeclareIncidentScreen()));
          },
          backgroundColor: const Color(0xFF007A8A),
          child: const Icon(Icons.add, size: 30),
        ),
      ),
    );
  }
}

class _IncidentList extends StatelessWidget {
  final String section;
  const _IncidentList({required this.section});

  // Hard-coded sample data
  List<Map<String, String>> get _items => [
        {
          'id': '#INC-01 CH 205',
          'title': 'Fridge',
          'date': '07/11/2025',
          'desc': 'the fridge is no longer...',
          'status': 'To replace',
          'statusColor': '0xFFD9534F'
        },
        {
          'id': '#INC-01 CH 205',
          'title': 'Socket',
          'date': '07/11/2025',
          'desc': 'The plug is damaged',
          'status': 'To repair',
          'statusColor': '0xFFF0AD4E'
        },
        {
          'id': '#INC-01 CH 205',
          'title': 'Frigo',
          'date': '07/11/2025',
          'desc': 'The plug is damaged',
          'status': 'Good condition',
          'statusColor': '0xFF2ECC71'
        },
        {
          'id': '#INC-01 CH 205',
          'title': 'Socket',
          'date': '07/11/2025',
          'desc': 'the fridge is no longer...',
          'status': 'To repair',
          'statusColor': '0xFFF0AD4E'
        },
      ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      child: ListView.separated(
        itemCount: _items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final it = _items[index];
          return _IncidentCard(
            id: it['id']!,
            title: it['title']!,
            date: it['date']!,
            description: it['desc']!,
            status: it['status']!,
            statusColor: Color(int.parse(it['statusColor']!)),
          );
        },
      ),
    );
  }
}

class _IncidentCard extends StatelessWidget {
  final String id;
  final String title;
  final String date;
  final String description;
  final String status;
  final Color statusColor;

  const _IncidentCard({
    required this.id,
    required this.title,
    required this.date,
    required this.description,
    required this.status,
    required this.statusColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: const Offset(0, 4))],
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          // avatar placeholder
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(id, style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('$title - $date', style: const TextStyle(fontSize: 14)),
                          const SizedBox(height: 6),
                          Text(description, style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w400)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(status, style: TextStyle(color: statusColor, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
