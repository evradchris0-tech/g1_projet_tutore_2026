import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../core/theme/app_theme.dart';
import '../core/constants/app_constants.dart';

class LoadingSkeleton extends StatelessWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const LoadingSkeleton({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppTheme.gray200,
      highlightColor: AppTheme.gray100,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppTheme.gray200,
          borderRadius:
              borderRadius ?? BorderRadius.circular(AppConstants.borderRadius),
        ),
      ),
    );
  }
}

class IncidentListItemSkeleton extends StatelessWidget {
  const IncidentListItemSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingMd),
        child: Row(
          children: [
            const LoadingSkeleton(width: 56, height: 56),
            const SizedBox(width: AppConstants.spacingMd),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const LoadingSkeleton(width: double.infinity, height: 16),
                  const SizedBox(height: 8),
                  const LoadingSkeleton(width: 150, height: 12),
                  const SizedBox(height: 8),
                  const LoadingSkeleton(width: 100, height: 12),
                ],
              ),
            ),
            const SizedBox(width: AppConstants.spacingMd),
            const LoadingSkeleton(width: 80, height: 24),
          ],
        ),
      ),
    );
  }
}















