import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:immo360/main.dart';

void main() {
  testWidgets('App launches successfully', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: ImmO360App(),
      ),
    );

    // Verify that the login screen is displayed
    expect(find.text('Welcome'), findsOneWidget);
    expect(find.text('IMMO360'), findsOneWidget);
  });
}
