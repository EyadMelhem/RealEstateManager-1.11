import 'package:equatable/equatable.dart';

class Tenant extends Equatable {
  final int? id;
  final String name;
  final String phone;
  final String? email;
  final String? nationalId;
  final String? emergencyContact;
  final String? emergencyPhone;
  final String? occupation;
  final String? notes;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const Tenant({
    this.id,
    required this.name,
    required this.phone,
    this.email,
    this.nationalId,
    this.emergencyContact,
    this.emergencyPhone,
    this.occupation,
    this.notes,
    required this.createdAt,
    this.updatedAt,
  });

  Tenant copyWith({
    int? id,
    String? name,
    String? phone,
    String? email,
    String? nationalId,
    String? emergencyContact,
    String? emergencyPhone,
    String? occupation,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Tenant(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      nationalId: nationalId ?? this.nationalId,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      emergencyPhone: emergencyPhone ?? this.emergencyPhone,
      occupation: occupation ?? this.occupation,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        phone,
        email,
        nationalId,
        emergencyContact,
        emergencyPhone,
        occupation,
        notes,
        createdAt,
        updatedAt,
      ];
}