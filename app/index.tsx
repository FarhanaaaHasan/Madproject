import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';

const quickActions = [
  { label: 'Add Medication', helper: 'Create a schedule', icon: 'medkit-outline', target: '/add-medicine', color: '#f06292' },
  { label: 'Add Reminder', helper: 'Dose + refill', icon: 'notifications-outline', target: '/add-reminder', color: '#69addb' },
  { label: 'Health Log', helper: 'BP / glucose / weight', icon: 'pulse-outline', target: '/health-logs', color: '#a78bfa' },
  { label: 'Appointment', helper: 'Doctor / lab visit', icon: 'calendar-outline', target: '/appointments', color: '#fb923c' },
];

export default function HomeScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const { user } = useAuth();
  const displayName = user?.name || user?.email || 'Medexa User';

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Decorative Header */}
        <View style={styles.headerDecoration}>
          <View style={[styles.decorCircle, { top: -20, right: -30, backgroundColor: '#f0629220' }]} />
          <View style={[styles.decorCircle, { bottom: -10, left: -40, backgroundColor: '#69addb20' }]} />
        </View>

        {/* Welcome Card */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.profileSection}>
              <View style={[styles.avatar, { backgroundColor: `${accent}25` }]}>
                <Ionicons name="person-circle" size={32} color={accent} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.welcomeText}>
                  Welcome back!
                </ThemedText>
                <ThemedText style={styles.userName}>Hi, {displayName}</ThemedText>
                <ThemedText style={styles.userSubtitle}>Age 35 • Keep tracking your health</ThemedText>
              </View>
              <Pressable onPress={() => router.push('/profile')} style={styles.editButton}>
                <Ionicons name="pencil" size={18} color={accent} />
              </Pressable>
            </View>

            {/* Primary Action Button */}
            <Pressable
              style={[styles.primaryButton, { backgroundColor: accent }]}
              onPress={() => router.push('/add-reminder')}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="add-circle" size={20} color="#fff" />
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>
                    Add New Reminder
                  </ThemedText>
                  <ThemedText style={styles.primaryButtonSubtext}>
                    Schedule your next dose
                  </ThemedText>
                </View>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Your Health Stats
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: accent }]}>
              <View style={[styles.statIcon, { backgroundColor: `${accent}20` }]}>
                <Ionicons name="heart" size={24} color={accent} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                86%
              </ThemedText>
              <ThemedText style={styles.statLabel}>Adherence</ThemedText>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#69addb' }]}>
              <View style={[styles.statIcon, { backgroundColor: '#69addb20' }]}>
                <Ionicons name="alarm" size={24} color="#69addb" />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                3
              </ThemedText>
              <ThemedText style={styles.statLabel}>Due Today</ThemedText>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#fb923c' }]}>
              <View style={[styles.statIcon, { backgroundColor: '#fb923c20' }]}>
                <Ionicons name="calendar" size={24} color="#fb923c" />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                Mar 5
              </ThemedText>
              <ThemedText style={styles.statLabel}>Next Visit</ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.actionsSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
                onPress={action.target ? () => router.push(action.target as any) : undefined}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
                  {action.label.split(' ')[1]}
                </ThemedText>
                <ThemedText style={styles.actionHelper}>{action.helper}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Reminders List Preview */}
        <View style={styles.remindersSection}>
          <View style={styles.remindersHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Today&apos;s Reminders
            </ThemedText>
            <Pressable onPress={() => router.push('/medications')}>
              <ThemedText style={styles.seeAllText}>See all</ThemedText>
            </Pressable>
          </View>

          <View style={styles.reminderItem}>
            <View style={[styles.reminderIcon, { backgroundColor: '#f0629220' }]}>
              <Ionicons name="medkit" size={20} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.reminderName}>
                Paracetamol XL 2
              </ThemedText>
              <ThemedText style={styles.reminderTime}>10:00 AM • 500mg</ThemedText>
            </View>
            <View style={[styles.reminderBadge, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
            </View>
          </View>

          <View style={styles.reminderItem}>
            <View style={[styles.reminderIcon, { backgroundColor: '#69addb20' }]}>
              <Ionicons name="medkit" size={20} color="#69addb" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.reminderName}>
                Abocavir
              </ThemedText>
              <ThemedText style={styles.reminderTime}>02:00 PM • 600mg</ThemedText>
            </View>
            <View style={[styles.reminderBadge, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="time" size={20} color="#fb923c" />
            </View>
          </View>
        </View>

        {/* Health Logs Section */}
        <View style={styles.remindersSection}>
          <View style={styles.remindersHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Health logs
            </ThemedText>
            <Pressable onPress={() => router.push('/health-logs')}>
              <ThemedText style={styles.seeAllText}>See all</ThemedText>
            </Pressable>
          </View>

          <View style={styles.healthLogItem}>
            <View style={[styles.healthLogIcon, { backgroundColor: '#ff6b9d20' }]}>
              <Ionicons name="heart" size={24} color="#ff6b9d" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.logName}>
                Blood Pressure
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.logValue}>
                118 / 76 mmHg
              </ThemedText>
              <ThemedText style={styles.logTime}>Today 7:30 AM</ThemedText>
            </View>
          </View>

          <View style={styles.healthLogItem}>
            <View style={[styles.healthLogIcon, { backgroundColor: '#4ecdc420' }]}>
              <Ionicons name="flask" size={24} color="#4ecdc4" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.logName}>
                Glucose (fasting)
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.logValue}>
                94 mg/dL
              </ThemedText>
              <ThemedText style={styles.logTime}>Today 7:35 AM</ThemedText>
            </View>
          </View>

          <View style={styles.healthLogItem}>
            <View style={[styles.healthLogIcon, { backgroundColor: '#ffa50020' }]}>
              <Ionicons name="scale" size={24} color="#ffa500" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.logName}>
                Weight
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.logValue}>
                71.4 kg
              </ThemedText>
              <ThemedText style={styles.logTime}>This week • -0.4 kg</ThemedText>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <View style={styles.footerTop}>
              <View style={[styles.footerIconBox, { backgroundColor: '#f0629220' }]}>
                <Ionicons name="heart" size={28} color="#f06292" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.footerTitle}>
                  Health First!
                </ThemedText>
                <ThemedText style={styles.footerSubtitle}>
                  3 reminders completed today
                </ThemedText>
              </View>
              <Ionicons name="star" size={24} color="#ffc107" />
            </View>

            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.footerStats}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>86%</ThemedText>
                <ThemedText style={styles.statLabel}>Adherence</ThemedText>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>7d</ThemedText>
                <ThemedText style={styles.statLabel}>Streak</ThemedText>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>15</ThemedText>
                <ThemedText style={styles.statLabel}>Total</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <ThemedText style={styles.footerVersion}>Medexa v1.0 • Last updated today</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerDecoration: {
    position: 'relative',
    height: 80,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 200,
    width: 400,
    height: 400,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    overflow: 'hidden',
  },
  cardInner: {
    padding: 20,
    gap: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2b3a42',
  },
  userSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButtonSubtext: {
    color: '#ffffff99',
    fontSize: 11,
    marginTop: 2,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#2b3a42',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  actionCardPressed: {
    opacity: 0.7,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2b3a42',
    marginBottom: 4,
  },
  actionHelper: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  remindersSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  remindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAllText: {
    fontSize: 12,
    color: '#f06292',
    fontWeight: '600',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderName: {
    fontSize: 14,
    color: '#2b3a42',
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 11,
    color: '#999',
  },
  reminderBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthLogItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  healthLogIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logName: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  logValue: {
    fontSize: 16,
    color: '#2b3a42',
    marginBottom: 4,
  },
  logTime: {
    fontSize: 11,
    color: '#999',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  footerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#f0629220',
  },
  footerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  footerIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTitle: {
    fontSize: 15,
    color: '#2b3a42',
    marginBottom: 2,
  },
  footerSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    width: '86%',
    backgroundColor: '#f06292',
    borderRadius: 3,
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f06292',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#f0f0f0',
  },
  footerBottom: {
    alignItems: 'center',
    paddingTop: 12,
  },
  footerVersion: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
});
