import 'package:equatable/equatable.dart';

class Property extends Equatable {
  final int? id;
  final String title;
  final String address;
  final String type;
  final int? rooms;
  final String? area;
  final double monthlyRent;
  final String ownerName;
  final String? ownerPhone;
  final String? ownerEmail;
  final String? description;
  final bool isAvailable;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const Property({
    this.id,
    required this.title,
    required this.address,
    required this.type,
    this.rooms,
    this.area,
    required this.monthlyRent,
    required this.ownerName,
    this.ownerPhone,
    this.ownerEmail,
    this.description,
    this.isAvailable = true,
    required this.createdAt,
    this.updatedAt,
  });

  Property copyWith({
    int? id,
    String? title,
    String? address,
    String? type,
    int? rooms,
    String? area,
    double? monthlyRent,
    String? ownerName,
    String? ownerPhone,
    String? ownerEmail,
    String? description,
    bool? isAvailable,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Property(
      id: id ?? this.id,
      title: title ?? this.title,
      address: address ?? this.address,
      type: type ?? this.type,
      rooms: rooms ?? this.rooms,
      area: area ?? this.area,
      monthlyRent: monthlyRent ?? this.monthlyRent,
      ownerName: ownerName ?? this.ownerName,
      ownerPhone: ownerPhone ?? this.ownerPhone,
      ownerEmail: ownerEmail ?? this.ownerEmail,
      description: description ?? this.description,
      isAvailable: isAvailable ?? this.isAvailable,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        address,
        type,
        rooms,
        area,
        monthlyRent,
        ownerName,
        ownerPhone,
        ownerEmail,
        description,
        isAvailable,
        createdAt,
        updatedAt,
      ];
}