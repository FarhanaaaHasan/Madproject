import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import Sidebar from '@/components/sidebar';
import { AuthProvider } from '@/hooks/use-auth';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

type SidebarContextValue = {
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextValue>({
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarValue = useMemo(
    () => ({
      toggleSidebar: () => setSidebarOpen((s) => !s),
      closeSidebar: () => setSidebarOpen(false),
    }),
    []
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <SidebarContext.Provider value={sidebarValue}>
          <View style={styles.container}>
            {sidebarOpen && (
              <View style={styles.sidebarWrapper}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </View>
            )}

            <View style={styles.content}>
              <Slot />
            </View>
          </View>
        </SidebarContext.Provider>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebarWrapper: { width: 260, backgroundColor: '#fff', elevation: 2 },
  content: { flex: 1 },
});
