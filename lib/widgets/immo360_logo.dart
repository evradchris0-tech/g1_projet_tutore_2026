import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';

class ImmO360Logo extends StatelessWidget {
  const ImmO360Logo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Logo SVG avec cercle vert et maison
        SizedBox(
          width: 80,
          height: 80,
          child: CustomPaint(painter: _ImmO360LogoPainter()),
        ),
        const SizedBox(height: AppConstants.spacingMd),
        // Texte IMMO360
        const Text(
          AppConstants.appName,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: Color(AppConstants.primaryColorValue),
            letterSpacing: 1,
          ),
        ),
        // Texte CAMEROUN
        const Text(
          AppConstants.appSubtitle,
          style: TextStyle(
            fontSize: 14,
            color: Color(AppConstants.primaryColorValue),
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}

class _ImmO360LogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final radius = size.width / 2;

    // Cercle vert de fond
    final circlePaint = Paint()
      ..color = const Color(AppConstants.successColorValue)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(centerX, centerY), radius, circlePaint);

    // Toit triangulaire (de 20 à 35 en Y, centré horizontalement)
    final roofPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    final roofPath = Path()
      ..moveTo(centerX, 20) // Sommet du toit
      ..lineTo(centerX + 15, 35) // Coin droit
      ..lineTo(centerX - 15, 35) // Coin gauche
      ..close();
    canvas.drawPath(roofPath, roofPaint);

    // Corps rectangulaire de la maison (de 35 à 60 en Y)
    final bodyPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawRect(Rect.fromLTWH(centerX - 15, 35, 30, 25), bodyPaint);

    // Fenêtre avec croix (à droite, de 42 à 50 en Y)
    final windowX = centerX + 5.0;
    const windowY = 42.0;
    const windowSize = 8.0;
    const windowStrokeWidth = 1.5;

    // Bordure de la fenêtre
    final windowBorderPaint = Paint()
      ..color = const Color(AppConstants.successColorValue)
      ..style = PaintingStyle.stroke
      ..strokeWidth = windowStrokeWidth;
    canvas.drawRect(
      Rect.fromLTWH(windowX, windowY, windowSize, windowSize),
      windowBorderPaint,
    );

    // Croix verticale
    final crossPaint = Paint()
      ..color = const Color(AppConstants.successColorValue)
      ..style = PaintingStyle.stroke
      ..strokeWidth = windowStrokeWidth;
    canvas.drawLine(
      Offset(windowX + windowSize / 2, windowY),
      Offset(windowX + windowSize / 2, windowY + windowSize),
      crossPaint,
    );

    // Croix horizontale
    canvas.drawLine(
      Offset(windowX, windowY + windowSize / 2),
      Offset(windowX + windowSize, windowY + windowSize / 2),
      crossPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
