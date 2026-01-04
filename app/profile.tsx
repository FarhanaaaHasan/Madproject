import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('Medexa User');
  const [email, setEmail] = useState('user@medexa.com');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [age, setAge] = useState('35');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('None');
  const [emergencyContact, setEmergencyContact] = useState('John Doe - 555-1234');

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            My Profile
          </ThemedText>
          {!isEditing && (
            <Pressable onPress={() => setIsEditing(true)}>
              <Ionicons name="pencil" size={20} color={accent} />
            </Pressable>
          )}
        </View>

        <View style={[styles.avatarBox, { backgroundColor: `${accent}20` }]}>
          <Ionicons name="person-circle" size={80} color={accent} />
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Full Name
              </ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Email
              </ThemedText>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Phone
              </ThemedText>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Age
              </ThemedText>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Blood Type
              </ThemedText>
              <TextInput
                style={styles.input}
                value={bloodType}
                onChangeText={setBloodType}
                placeholder="E.g., O+"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Known Allergies
              </ThemedText>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={allergies}
                onChangeText={setAllergies}
                placeholder="List any allergies"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Emergency Contact
              </ThemedText>
              <TextInput
                style={styles.input}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="Name and phone number"
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: accent }]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Save Profile</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Personal Information
              </ThemedText>

              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Name</ThemedText>
                  <ThemedText type="defaultSemiBold">{name}</ThemedText>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Email</ThemedText>
                  <ThemedText type="defaultSemiBold">{email}</ThemedText>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Phone</ThemedText>
                  <ThemedText type="defaultSemiBold">{phone}</ThemedText>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Age</ThemedText>
                  <ThemedText type="defaultSemiBold">{age}</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Medical Information
              </ThemedText>

              <View style={styles.detailRow}>
                <Ionicons name="water-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Blood Type</ThemedText>
                  <ThemedText type="defaultSemiBold">{bloodType}</ThemedText>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="warning-outline" size={20} color="#d9534f" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Allergies</ThemedText>
                  <ThemedText type="defaultSemiBold">{allergies}</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Emergency Contact
              </ThemedText>

              <View style={styles.detailRow}>
                <Ionicons name="phone-portrait-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText type="defaultSemiBold">{emergencyContact}</ThemedText>
                </View>
              </View>
            </View>

            <Pressable
              style={[styles.button, styles.logoutButton]}
              onPress={async () => {
                await signOut();
                router.replace('/login');
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Logout</ThemedText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  avatarBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  detailsContainer: { paddingHorizontal: 16, gap: 20 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, marginBottom: 8, color: '#333' },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  editForm: { paddingHorizontal: 16, gap: 16 },
  formGroup: { gap: 8 },
  label: { fontSize: 14 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 20,
  },
  logoutButton: { backgroundColor: '#d9534f' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
