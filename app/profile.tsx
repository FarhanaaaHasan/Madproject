import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopHeader } from '@/components/top-header';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { profileService } from '@/lib/profile-service';

export default function ProfileScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const profile = await profileService.getProfile(user.id);
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
        setAge(profile.age);
        setBloodType(profile.bloodType);
        setAllergies(profile.allergies);
        setEmergencyContact(profile.emergencyContact);
        console.log('[Profile] Loaded user profile from Firestore');
      } else {
        // Set defaults from user auth if no profile exists
        setEmail(user.email || '');
        setName(user.name || 'Medexa User');
        console.log('[Profile] No profile found, using auth data');
      }
    } catch (error) {
      console.error('[Profile] Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load profile data when component mounts
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save profile');
      return;
    }

    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsSaving(true);
    try {
      console.log('[Profile] Saving profile with data:', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: age.trim(),
        bloodType: bloodType.trim(),
        allergies: allergies.trim(),
        emergencyContact: emergencyContact.trim(),
      });

      await profileService.saveProfile({
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: age.trim(),
        bloodType: bloodType.trim(),
        allergies: allergies.trim(),
        emergencyContact: emergencyContact.trim(),
      });
      
      console.log('[Profile] Profile saved successfully to Firestore');
      Alert.alert('Success', 'Profile saved successfully!');
      setIsEditing(false);
      
      // Reload profile to verify save
      await loadProfile();
    } catch (error) {
      console.error('[Profile] Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <TopHeader 
        title="Profile"
        right={
          <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#444" />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {!isEditing && !isLoading && (
            <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={accent} />
              <ThemedText style={[styles.editButtonText, { color: accent }]}>Edit Profile</ThemedText>
            </Pressable>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={accent} />
            <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
          </View>
        ) : (
          <>
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
                    editable={!isSaving}
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
                    editable={!isSaving}
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
                    editable={!isSaving}
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
                    editable={!isSaving}
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
                    editable={!isSaving}
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
                    editable={!isSaving}
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
                    editable={!isSaving}
                  />
                </View>

                <Pressable
                  style={[styles.button, { backgroundColor: accent, opacity: isSaving ? 0.6 : 1 }]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                  <ThemedText style={styles.buttonText}>
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </ThemedText>
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
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: {
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: { marginTop: 12, color: '#999' },
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
