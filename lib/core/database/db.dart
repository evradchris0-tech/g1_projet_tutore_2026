import 'dart:async';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DB {
  DB._();
  static final DB instance = DB._();

  static Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _init();
    return _db!;
  }

  Future<Database> _init() async {
    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, 'app_data.db');

    return await openDatabase(path, version: 1, onCreate: _onCreate);
  }

  FutureOr<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE auth (
        id TEXT PRIMARY KEY,
        username TEXT,
        role TEXT,
        token TEXT
      )
    ''');
  }

  Future<void> saveAuth({required String id, required String username, required String role, required String token}) async {
    final db = await database;
    await db.insert('auth', {'id': id, 'username': username, 'role': role, 'token': token}, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<Map<String, dynamic>?> getAuth() async {
    final db = await database;
    final list = await db.query('auth', limit: 1);
    if (list.isEmpty) return null;
    return list.first;
  }

  Future<void> clearAuth() async {
    final db = await database;
    await db.delete('auth');
  }
}
