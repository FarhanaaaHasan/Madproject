import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren, useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SidebarContext } from '@/app/_layout';
import { ThemedText } from '@/components/themed-text';

type TopHeaderProps = PropsWithChildren<{
  title: string;
  right?: React.ReactNode;
}>;

export function TopHeader({ title, right }: TopHeaderProps) {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <View style={styles.container}>
      <Pressable style={styles.menuButton} onPress={toggleSidebar}>
        <Ionicons name="menu" size={22} color="#444" />
      </Pressable>

      <ThemedText type="defaultSemiBold" style={styles.title}>
        {title}
      </ThemedText>

      <View style={styles.right}>{right || <View style={{ width: 24 }} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  right: {
    minWidth: 24,
    alignItems: 'flex-end',
  },
});
