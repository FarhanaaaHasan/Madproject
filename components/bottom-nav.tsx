import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

const TAB_ITEMS = [
  { name: 'Home', icon: 'home', route: '/' },
  { name: 'Medications', icon: 'medkit', route: '/medications' },
  { name: 'Appointments', icon: 'calendar', route: '/appointments' },
  { name: 'Profile', icon: 'person', route: '/profile' },
];

export function BottomNav() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = `/${segments[0] || ''}`;

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {TAB_ITEMS.map((item) => {
          const isActive = currentRoute === item.route || (item.route === '/' && currentRoute === '/');
          return (
            <Pressable
              key={item.name}
              style={styles.navItem}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={isActive ? '#f06292' : '#b0bec5'}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#f06292',
    paddingBottom: 8,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
