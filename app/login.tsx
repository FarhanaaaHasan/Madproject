import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';

const softBackground = '#fdf5f9';

export default function LoginScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const busy = loading || authLoading;

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const getErrorMessage = (code: string): string => {
    const errorMap: { [key: string]: string } = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/user-disabled': 'This account has been disabled',
      'auth/too-many-requests': 'Too many login attempts. Please try again later',
      'auth/invalid-email': 'Invalid email format',
      'auth/missing-password': 'Please enter your password',
    };
    return errorMap[code] || (typeof code === 'string' ? code : 'Login failed. Please try again');
  };

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password: password.trim() });
      router.replace('/');
    } catch (e: any) {
      console.warn('Login error', e);
      const errorCode = e?.code || 'unknown';
      const errorMsg = getErrorMessage(errorCode);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.bgBlock} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandCard}>
          <View style={styles.brandBadge}>
            <Ionicons name="heart" size={18} color="#fff" />
          </View>
          <ThemedText type="title" style={styles.brandTitle}>
            Medexa
          </ThemedText>
          <ThemedText style={styles.brandSubtitle}>
            Caring partner for your daily meds and reminders.
          </ThemedText>
        </View>

        <ThemedView style={styles.formCard}>
          <ThemedText type="subtitle">Welcome back</ThemedText>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={accent} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9aa"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!busy}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={accent} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9aa"
              secureTextEntry
              editable={!busy}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable disabled={busy}>
              <ThemedText style={styles.helper}>Forgot?</ThemedText>
            </Pressable>
          </View>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: accent, opacity: busy ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.primaryButtonText}>Log in</ThemedText>
            )}
          </Pressable>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#d9534f" />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          <View style={styles.divider}>
            <View style={styles.line} />
            <ThemedText style={styles.helper}>or continue with</ThemedText>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            {['logo-google', 'logo-apple', 'logo-facebook'].map((icon) => (
              <Pressable key={icon} style={styles.socialButton} disabled={busy}>
                <Ionicons name={icon as any} size={18} color="#2b3a42" />
              </Pressable>
            ))}
          </View>
        </ThemedView>

        <Pressable onPress={() => router.push('/signup')} disabled={busy} style={styles.switchRow}>
          <ThemedText style={styles.helper}>New to Medexa? </ThemedText>
          <ThemedText type="defaultSemiBold" style={{ color: accent }}>
            Create account
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  bgBlock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fef6fa',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  brandCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    gap: 10,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f06292',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#2b3a42',
    textAlign: 'center',
  },
  brandSubtitle: {
    color: '#5c706c',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: softBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5dce8',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: '#2b3a42',
  },
  helper: {
    color: '#5c706c',
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#d9534f',
    flex: 1,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f5dce8',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5dce8',
    backgroundColor: '#fdf5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
});
