import { LANGUAGE_LABELS_EN, SUPPORTED_LANGUAGES } from '@speakmynotes/contracts';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchHealth, type HealthResult } from '@/lib/api';
import { config } from '@/lib/config';

export default function HomeScreen() {
  const [result, setResult] = useState<HealthResult | null>(null);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    setResult(await fetchHealth());
    setChecking(false);
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Speak My Notes</Text>
      <Text style={styles.subtitle}>Turn today&apos;s lesson into a conversation.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Supported languages</Text>
        {SUPPORTED_LANGUAGES.map((code) => (
          <Text key={code} style={styles.row}>
            {LANGUAGE_LABELS_EN[code]} ({code})
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>API connection</Text>
        <Text style={styles.mono}>{config.apiUrl}</Text>
        {!config.isConfiguredApiUrl && (
          <Text style={styles.warning}>
            EXPO_PUBLIC_API_URL is not set. A physical phone cannot reach localhost; see docs/DEVELOPMENT.md.
          </Text>
        )}
        {checking && <Text style={styles.row}>Checking…</Text>}
        {!checking && result?.ok && (
          <>
            <Text style={styles.ok}>Connected</Text>
            <Text style={styles.row}>Service: {result.health.service}</Text>
            <Text style={styles.row}>Version: {result.health.version}</Text>
            <Text style={styles.row}>Provider mode: {result.health.provider_mode}</Text>
          </>
        )}
        {!checking && result && !result.ok && (
          <>
            <Text style={styles.error}>Not reachable</Text>
            <Text style={styles.row}>
              {result.error.code}: {result.error.message}
            </Text>
          </>
        )}
        <Pressable accessibilityRole="button" onPress={check} disabled={checking} style={styles.button}>
          <Text style={styles.buttonText}>Check again</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>Milestone 1: foundation only. Screens arrive in milestone 2.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#444' },
  card: { borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 16, gap: 6 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  row: { fontSize: 16 },
  mono: { fontFamily: 'monospace', fontSize: 14, color: '#333' },
  warning: { fontSize: 14, color: '#8A5A00' },
  ok: { fontSize: 16, fontWeight: '600', color: '#1B7F3B' },
  error: { fontSize: 16, fontWeight: '600', color: '#B00020' },
  button: { marginTop: 8, backgroundColor: '#1F4E79', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { fontSize: 13, color: '#777', textAlign: 'center' },
});
