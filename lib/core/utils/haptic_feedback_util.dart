import 'package:flutter/services.dart';

class HapticFeedbackUtil {
  // Feedback léger pour interactions simples
  static void light() {
    HapticFeedback.lightImpact();
  }

  // Feedback moyen pour actions importantes
  static void medium() {
    HapticFeedback.mediumImpact();
  }

  // Feedback fort pour actions critiques
  static void heavy() {
    HapticFeedback.heavyImpact();
  }

  // Feedback pour sélection (toggle, switch)
  static void selection() {
    HapticFeedback.selectionClick();
  }

  // Feedback pour erreur
  static void error() {
    HapticFeedback.heavyImpact();
  }

  // Feedback pour succès
  static void success() {
    HapticFeedback.mediumImpact();
  }
}










