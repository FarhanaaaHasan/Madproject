import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function StatusBar() {
  const [time, setTime] = useState('9:30 PM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setTime(`${displayHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.statusBar}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.icons}>
        <Ionicons name="ellipsis-horizontal" size={12} color="#000" />
        <Ionicons name="wifi" size={12} color="#000" />
        <Ionicons name="battery-full" size={12} color="#000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  icons: {
    flexDirection: 'row',
    gap: 4,
  },
});
