import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  backTo?: string;
};

export default function SuccessModal({ visible, onClose, title = 'Success', message = "Congratulations! your medication is added successfully", backTo }: Props) {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();

  const handleBack = () => {
    onClose();
    if (backTo) router.push(backTo as any);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={48} color={accent} />
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>

          <Pressable style={[styles.button, { backgroundColor: accent }]} onPress={handleBack}>
            <ThemedText style={styles.buttonText}>Back to home</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
