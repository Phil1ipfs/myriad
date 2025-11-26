import 'package:flutter/material.dart';

/// A reusable widget for displaying profile pictures with proper error handling
class ProfileAvatar extends StatelessWidget {
  final String? imageUrl;
  final double radius;
  final Color? backgroundColor;

  const ProfileAvatar({
    super.key,
    this.imageUrl,
    this.radius = 20,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: backgroundColor ?? Colors.grey[300],
      backgroundImage: (imageUrl != null && imageUrl!.isNotEmpty)
          ? NetworkImage(imageUrl!)
          : null,
      onBackgroundImageError: (exception, stackTrace) {
        // Log error for debugging
        debugPrint('❌ Failed to load profile image: $imageUrl');
        debugPrint('   Error: $exception');
      },
    );
  }

  /// Helper method to construct full profile image URL from path
  static String getProfileImageUrl(String? imagePath) {
    if (imagePath == null || imagePath.isEmpty) {
      return '';
    }

    const serverUrl = 'https://janna-server.onrender.com';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it starts with /, prepend the server URL
    if (imagePath.startsWith('/')) {
      return '$serverUrl$imagePath';
    }

    // Otherwise, construct the URL
    return '$serverUrl/$imagePath';
  }
}