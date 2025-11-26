import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool isLoading = false;

  // 🔹 Change Password
  Future<void> _changePassword() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) throw Exception("No token found.");

      final response = await http.put(
        Uri.parse("https://janna-server.onrender.com/api/auth/change-password"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "oldPassword": _oldPasswordController.text.trim(),
          "newPassword": _newPasswordController.text.trim(),
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ Password changed successfully!")),
        );
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? "Failed to change password"),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("❌ Error: $e")));
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  void dispose() {
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // 🔹 UI
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Change Password",
          style: TextStyle(
            fontFamily: 'Sahitya',
            fontWeight: FontWeight.w700,
            fontSize: 22,
          ),
        ),
        backgroundColor: const Color(0xFFB36CC6),
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _buildPasswordForm(),
      ),
    );
  }

  // 🔹 Password Change Form
  Widget _buildPasswordForm() {
    return Form(
      key: _formKey,
      child: ListView(
        children: [
          TextFormField(
            controller: _oldPasswordController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: "Old Password",
              border: OutlineInputBorder(),
            ),
            validator: (v) =>
                v == null || v.isEmpty ? "Enter your old password" : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _newPasswordController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: "New Password",
              border: OutlineInputBorder(),
              helperText: "Must be at least 6 characters",
            ),
            validator: (v) {
              if (v == null || v.isEmpty) {
                return "Password is required";
              }
              if (v.length < 6) {
                return "Password must be at least 6 characters";
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _confirmPasswordController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: "Confirm New Password",
              border: OutlineInputBorder(),
            ),
            validator: (v) => v != _newPasswordController.text
                ? "Passwords do not match"
                : null,
          ),
          const SizedBox(height: 30),
          ElevatedButton(
            onPressed: isLoading ? null : _changePassword,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFB36CC6),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            child: isLoading
                ? const CircularProgressIndicator(
                    color: Colors.white,
                    strokeWidth: 2,
                  )
                : const Text("Change Password"),
          ),
        ],
      ),
    );
  }
}
