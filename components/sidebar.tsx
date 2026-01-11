import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/hooks/use-auth';

type Props = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: Props) {
  const router = useRouter();
  // Auth removed - show guest info and perform simple navigation on logout
  const { user, signOut } = useAuth();

  const nav = (path: string) => {
    onClose?.();
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>{/* placeholder */}
          <Ionicons name="person" size={28} color="#fff" />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>{user?.name ?? user?.email ?? 'Guest'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>
      </View>

      <Pressable style={styles.item} onPress={() => nav('/')}>
        <Ionicons name="home-outline" size={20} color="#333" />
        <Text style={styles.itemText}>Dashboard</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => nav('/add-medicine')}>
        <Ionicons name="medkit-outline" size={20} color="#333" />
        <Text style={styles.itemText}>Add Medication</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => nav('/medications')}>
        <Ionicons name="list-outline" size={20} color="#333" />
        <Text style={styles.itemText}>Medications</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => nav('/add-reminder')}>
        <Ionicons name="notifications-outline" size={20} color="#333" />
        <Text style={styles.itemText}>Create Reminder</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => nav('/add-health-log')}>
        <Ionicons name="heart-outline" size={20} color="#333" />
        <Text style={styles.itemText}>Add Health Log</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => nav('/add-appointment')}>
        <Ionicons name="calendar-outline" size={20} color="#333" />
        <Text style={styles.itemText}>Add Appointment</Text>
      </Pressable>

      <View style={styles.footer}>
        <Pressable style={styles.item} onPress={() => nav('/profile')}>
          <Ionicons name="person-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Profile</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={async () => {
            onClose?.();
            await signOut();
            router.replace('/login');
          }}>
          <Ionicons name="log-out-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#f06292',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontWeight: '700', fontSize: 16 },
  email: { color: '#666', fontSize: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  itemText: { marginLeft: 8, fontSize: 15, color: '#222' },
  footer: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
});
