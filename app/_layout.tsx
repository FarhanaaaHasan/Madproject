import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import Sidebar from '@/components/sidebar';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
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
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
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
