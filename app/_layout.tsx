import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { BottomNav } from '@/components/bottom-nav';
import Sidebar from '@/components/sidebar';
import { StatusBar as AppStatusBar } from '@/components/status-bar';

import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppStatusBar />
        <View style={styles.container}>
          {sidebarOpen && (
            <View style={styles.sidebarWrapper}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.topBar}>
              <Pressable onPress={() => setSidebarOpen((s) => !s)} style={styles.menuButton}>
                <Ionicons name="menu" size={22} color="#222" />
              </Pressable>
              <Text style={styles.appTitle}>Medexa</Text>
            </View>

            <Slot />

            <BottomNav />
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function AuthCheck() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/signup');

  useEffect(() => {
    if (loading) return;
    if (!user && !isAuthRoute) {
      if (!pathname.includes('/login')) {
        router.replace('/login');
      }
      return;
    }
    if (user && isAuthRoute) {
      router.replace('/');
    }
  }, [user, loading, router, isAuthRoute, pathname]);

  const LoadingView = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#f06292" />
    </View>
  );

  if (loading) {
    return <LoadingView />;
  }

  // If user is logged in, show the app
  if (user) {
    return <AppContent />;
  }

  // If no user and on auth route, show login/signup pages
  if (isAuthRoute) {
    return (
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaView style={{ flex: 1 }}>
          <Slot />
          <StatusBar style="auto" />
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  // If no user and NOT on auth route, redirect to login and show loading
  if (pathname !== '/login') {
    router.replace('/login');
  }
  return <LoadingView />;

}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <AuthCheck />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebarWrapper: { width: 260, backgroundColor: '#fff', elevation: 2 },
  content: { flex: 1 },
  topBar: { height: 56, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 12, gap: 12 },
  menuButton: { padding: 8 },
  appTitle: { fontSize: 18, fontWeight: '700' },
});
