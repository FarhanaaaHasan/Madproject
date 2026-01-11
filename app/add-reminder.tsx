import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopHeader } from '@/components/top-header';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { reminderService } from '@/lib/reminder-service';

const reminderTypes = ['Medicine', 'Health Checkup', 'Refill', 'Doctor Visit'];
const frequencies = ['Daily', 'Weekly', 'Monthly', 'Custom'];

export default function AddReminderScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const cardBg = useThemeColor({ light: '#fdf5f9', dark: '#111' }, 'background');
  const router = useRouter();
  const { user } = useAuth();

  const [reminderName, setReminderName] = useState('');
  const [reminderType, setReminderType] = useState('Medicine');
  const [frequency, setFrequency] = useState('Daily');
  const [description, setDescription] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['8:00 AM', '5:00 PM']);
  const [isLoading, setIsLoading] = useState(false);
  const nextTimeLabel = useMemo(() => `${7 + selectedTimes.length}:00 AM`, [selectedTimes.length]);

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const addTime = () => {
    if (selectedTimes.includes(nextTimeLabel)) return;
    setSelectedTimes((prev) => [...prev, nextTimeLabel]);
  };

  const removeTime = (time: string) => {
    if (selectedTimes.length > 1) {
      setSelectedTimes((prev) => prev.filter((t) => t !== time));
    } else {
      Alert.alert('Required', 'Please keep at least one reminder time.');
    }
  };

  const saveReminder = async () => {
    if (!reminderName.trim()) {
      Alert.alert('Missing', 'Please enter a reminder name.');
      return;
    }
    if (!selectedTimes.length) {
      Alert.alert('Required', 'Please select at least one reminder time.');
      return;
    }
    if (!user?.id) {
      Alert.alert('Not signed in', 'Please log in to save reminders.');
      return;
    }

    setIsLoading(true);
    try {
      await reminderService.addReminder({
        userId: user.id,
        name: reminderName.trim(),
        type: reminderType,
        frequency,
        description: description.trim() || undefined,
        times: selectedTimes,
      });

      Alert.alert('Success', `Reminder "${reminderName}" saved!`);
      setReminderName('');
      setDescription('');
      setSelectedTimes(['8:00 AM', '5:00 PM']);
      setReminderType('Medicine');
      setFrequency('Daily');
      router.back();
    } catch (error: any) {
      console.error('[AddReminder] Save error:', error);
      const msg = error?.message || 'Failed to save reminder.';
      Alert.alert('Error', String(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <TopHeader 
        title="Add Reminder"
        right={
          <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={20} color="#444" />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ThemedView style={[styles.hero, { backgroundColor: accent }]}>
          <View style={styles.heroHeaderTop}>
            <View style={styles.heroHeader}>
              <ThemedText type="title" style={styles.heroTitle}>
                Add Reminder
              </ThemedText>
              <View style={styles.heroPill}>
                <Ionicons name="notifications-outline" size={16} color={accent} />
                <ThemedText style={styles.heroPillText}>Stay on track with medication</ThemedText>
              </View>
            </View>
            <Pressable 
              style={styles.calendarButton}
              onPress={() => {
                // Open Google Calendar
                if (typeof window !== 'undefined') {
                  window.open('https://calendar.google.com', '_blank');
                }
              }}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroStats}>
            <View>
              <ThemedText style={styles.heroStatLabel}>Active</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.heroStatValue}>
                5
              </ThemedText>
            </View>
            <View>
              <ThemedText style={styles.heroStatLabel}>This week</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.heroStatValue}>
                32 times
              </ThemedText>
            </View>
            <View>
              <ThemedText style={styles.heroStatLabel}>On time</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.heroStatValue}>
                94%
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Reminder Details Card */}
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Reminder details</ThemedText>
          
          <View style={styles.inputRow}>
            <Ionicons name="notifications-outline" size={18} color={accent} />
            <TextInput
              style={styles.input}
              placeholder="Reminder name"
              placeholderTextColor="#9aa"
              value={reminderName}
              onChangeText={setReminderName}
            />
          </View>

          <View style={styles.chipRow}>
            {reminderTypes.map((type) => {
              const active = reminderType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setReminderType(type)}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? accent : '#d9e6ec',
                      backgroundColor: active ? accent : cardBg,
                    },
                  ]}>
                  <ThemedText
                    style={[
                      styles.chipText,
                      active && { color: '#fff', fontWeight: '700' },
                    ]}>
                    {type}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="document-text-outline" size={18} color={accent} />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add notes (optional)"
              placeholderTextColor="#9aa"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </ThemedView>

        {/* Frequency Card */}
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Frequency</ThemedText>
          <View style={styles.chipRow}>
            {frequencies.map((freq) => {
              const active = frequency === freq;
              return (
                <Pressable
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? accent : '#d9e6ec',
                      backgroundColor: active ? accent : cardBg,
                    },
                  ]}>
                  <ThemedText
                    style={[
                      styles.chipText,
                      active && { color: '#fff', fontWeight: '700' },
                    ]}>
                    {freq}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </ThemedView>

        {/* Reminder Times Card */}
        <ThemedView style={styles.card}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Reminder times</ThemedText>
            <View style={styles.timeBadge}>
              <ThemedText style={styles.timeBadgeText}>{selectedTimes.length}</ThemedText>
            </View>
          </View>

          <View style={styles.timeChipsContainer}>
            {['7:00 AM', '8:00 AM', '12:00 PM', '5:00 PM', '8:00 PM', '9:00 PM'].map((time) => {
              const active = selectedTimes.includes(time);
              return (
                <Pressable
                  key={time}
                  style={[
                    styles.timeChip,
                    {
                      borderColor: active ? accent : '#d9e6ec',
                      backgroundColor: active ? `${accent}15` : '#f5fbff',
                    },
                  ]}
                  onPress={() => toggleTime(time)}>
                  <Ionicons name="time-outline" size={14} color={accent} />
                  <ThemedText style={[styles.timeChipText, { color: active ? accent : '#5c706c' }]}>
                    {time}
                  </ThemedText>
                  {active && <Ionicons name="checkmark-circle" size={14} color={accent} />}
                </Pressable>
              );
            })}
            <Pressable
              style={[
                styles.timeChip,
                {
                  borderStyle: 'dashed',
                  borderColor: accent,
                  backgroundColor: `${accent}08`,
                },
              ]}
              onPress={addTime}>
              <Ionicons name="add-circle-outline" size={14} color={accent} />
              <ThemedText style={[styles.timeChipText, { color: accent, fontWeight: '600' }]}>
                Add {nextTimeLabel}
              </ThemedText>
            </Pressable>
          </View>

          {selectedTimes.length > 0 && (
            <View style={styles.selectedTimesContainer}>
              <ThemedText style={styles.selectedTimesLabel}>Selected times:</ThemedText>
              <View style={styles.selectedTimesList}>
                {selectedTimes.map((time) => (
                  <Pressable
                    key={time}
                    style={[styles.selectedTimeTag, { backgroundColor: `${accent}20` }]}
                    onPress={() => removeTime(time)}>
                    <ThemedText style={[styles.selectedTimeTagText, { color: accent }]}>
                      {time}
                    </ThemedText>
                    <Ionicons name="close" size={14} color={accent} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ThemedView>

        {/* Save Button */}
        <Pressable
          style={[styles.primaryButton, { backgroundColor: accent, opacity: isLoading ? 0.7 : 1 }]}
          onPress={saveReminder}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <ThemedText style={styles.primaryButtonText}>Save Reminder</ThemedText>
            </>
          )}
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  hero: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  heroHeader: { gap: 8 },
  heroHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  calendarButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '700' },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroPillText: {
    color: '#f06292',
    fontSize: 12,
    fontWeight: '600',
  },
  heroStats: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  heroStatLabel: {
    color: '#e5f6ff',
    fontSize: 12,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fdf5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5dce8',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: '#2b3a42',
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: '#f5dce8',
  },
  chipText: {
    color: '#5c706c',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: '#f06292',
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  timeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  selectedTimesContainer: {
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  selectedTimesLabel: {
    fontSize: 12,
    color: '#5c706c',
    fontWeight: '600',
  },
  selectedTimesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedTimeTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
