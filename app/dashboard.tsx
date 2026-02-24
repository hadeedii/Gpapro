import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { loadData, AppData, saveData } from '@/src/utils/storage';
import { Semester, calculateCGPA } from '@/src/utils/calculations';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GpaWheel } from '@/components/ui/gpa-wheel';
import { SegmentedNav } from '@/components/ui/segmented-nav';
import { CustomAlert } from '@/components/ui/custom-alert';
import Animated, { FadeInUp, FadeInRight, LinearTransition } from 'react-native-reanimated';
import { generateReportHtml } from '@/src/utils/generateReport';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const refresh = async () => {
    const d = await loadData();
    setData(d);
  };

  // State for Custom Alerts
  const [deleteAlert, setDeleteAlert] = useState<{ visible: boolean; id: number | null }>({ visible: false, id: null });
  const [switchAlert, setSwitchAlert] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const deleteSemester = (id: number) => {
    setDeleteAlert({ visible: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteAlert.id;
    if (!data || id === null) return;
    const updatedSemesters = data.semesters.filter(s => s.id !== id);
    const updatedData = {
      ...data,
      semesters: updatedSemesters,
      cgpa: calculateCGPA(updatedSemesters)
    };
    await saveData(updatedData);
    setData(updatedData);
    setDeleteAlert({ visible: false, id: null });
  };

  const editSemester = (semester: Semester) => {
    // Pass the semester ID to SGPA screen for editing
    router.push({
      pathname: '/sgpa',
      params: { id: semester.id.toString() }
    });
  };

  const switchUniversity = () => {
    setSwitchAlert(true);
  };

  const getCgpaStatus = (cgpa: number) => {
    if (cgpa === 0) return { label: 'No Data', color: themeColors.muted };
    if (cgpa >= 3.5) return { label: 'Excellent', color: themeColors.tint };
    if (cgpa >= 3.0) return { label: 'Good', color: '#10b981' }; // green
    if (cgpa >= 2.0) return { label: 'Normal', color: '#f59e0b' }; // orange
    return { label: 'Bad', color: themeColors.error }; // red
  };

  const downloadReport = async () => {
    if (!data) return;
    try {
      const html = generateReportHtml(data);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or share your GPA Report',
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (e) {
      console.error('PDF generation failed', e);
    }
  };

  const renderSemester = ({ item, index }: { item: Semester; index: number }) => (
    <Card delay={600 + index * 100} style={styles.semCard}>
      <View style={styles.semHeader}>
        <View style={styles.iconContainer}>
          <IconSymbol name="book.closed.fill" size={20} color={themeColors.text} />
        </View>
        <View style={styles.semInfo}>
          <Text style={[styles.semTitle, { color: themeColors.text }]}>Semester {item.id}</Text>
          <Text style={[styles.semDate, { color: themeColors.muted }]}>
            {item.subjects.length} Subjects • {item.sgpa.toFixed(2)} SGPA
          </Text>
        </View>
        <View style={styles.semActions}>
          <Pressable
            onPress={() => editSemester(item)}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="pencil" size={18} color={themeColors.tint} />
          </Pressable>
          <Pressable
            onPress={() => deleteSemester(item.id)}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="trash" size={18} color={themeColors.error} />
          </Pressable>
        </View>
      </View>
    </Card>
  );

  if (!data) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <Text style={{ color: themeColors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#E2E8F0', '#F7FAFC']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topHeader}>
            <Animated.View entering={FadeInRight.delay(100).duration(500)}>
              <Pressable
                onPress={downloadReport}
                style={[styles.settingsBtn, { backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.5)' }]}
              >
                <IconSymbol name="arrow.down.to.line" size={20} color={themeColors.text} />
              </Pressable>
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(200).duration(600)} style={{ flex: 1 }}>
              <Text style={[styles.welcome, { color: themeColors.text }]}>Statistic</Text>
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(300).duration(700)}>
              <Pressable
                onPress={() => router.push('/settings')}
                style={[styles.settingsBtn, { backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.5)' }]}
              >
                <IconSymbol name="gearshape.fill" size={20} color={themeColors.text} />
              </Pressable>
            </Animated.View>
          </View>

          <Card delay={400} style={styles.periodCard}>
            <View style={styles.periodContent}>
              <Text style={[styles.periodLabel, { color: themeColors.muted }]}>University:</Text>
              <Text numberOfLines={1} style={[styles.periodValue, { color: themeColors.text, flexShrink: 1 }]}>
                {data.university}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color={themeColors.muted} />
          </Card>

          <Card delay={500} style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={styles.scoreInfo}>
                <Text style={[styles.scoreLabel, { color: themeColors.muted }]}>CURRENT CGPA</Text>
                <Text style={[styles.scoreValue, { color: themeColors.text }]}>{data.cgpa.toFixed(2)}</Text>
              </View>
              <View style={[styles.scoreIconCircle, { backgroundColor: themeColors.tint + '15' }]}>
                <IconSymbol name="chart.bar.fill" size={28} color={themeColors.tint} />
              </View>
            </View>
            <View style={styles.scoreFooter}>
              <Text style={[styles.scoreFooterText, { color: themeColors.muted }]}>Based on {data.semesters.length} semesters</Text>

              {data.cgpa > 0 && (
                <View style={[styles.pillBadge, { backgroundColor: getCgpaStatus(data.cgpa).color + '15' }]}>
                  <Text style={[styles.pillText, { color: getCgpaStatus(data.cgpa).color }]}>
                    {getCgpaStatus(data.cgpa).label}
                  </Text>
                </View>
              )}
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Semesters</Text>
          </View>

          <Animated.FlatList
            data={data.semesters.sort((a, b) => b.id - a.id)}
            keyExtractor={item => item.id.toString()}
            itemLayoutAnimation={LinearTransition}
            renderItem={renderSemester}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <IconSymbol name="doc.text" size={48} color={themeColors.border} />
                <Text style={[styles.emptyText, { color: themeColors.muted }]}>No semesters added yet.</Text>
              </View>
            }
          />

          <View style={styles.fabContainer}>
            <CustomButton
              title="Add Semester"
              onPress={() => router.push('/sgpa')}
              style={styles.fab}
              textStyle={{ color: '#000000' }}
            />
          </View>
        </View>

        <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'transparent' }}>
          <BannerAd
  
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </SafeAreaView>

      <CustomAlert
        visible={deleteAlert.visible}
        title="Delete Semester"
        message="Are you sure you want to delete this semester? This action cannot be undone."
        type="error"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onClose={() => setDeleteAlert({ visible: false, id: null })}
      />

      <CustomAlert
        visible={switchAlert}
        title="Switch University"
        message="Are you sure you want to change your university? This will not delete your data."
        type="info"
        confirmText="Yes, Switch"
        onConfirm={() => router.replace('/university-select')}
        onClose={() => setSwitchAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.xl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  uniButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    maxWidth: '40%',
  },
  uniButtonText: {
    fontSize: 12,
    fontWeight: '800',
    flexShrink: 1,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '900',
    flex: 1,
    textAlign: 'center'
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  periodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    // Style will be inherited from Card Glass component
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scoreInfo: { flex: 1 },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    marginTop: 2,
  },
  scoreIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  scoreFooterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    paddingLeft: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  listContent: { paddingBottom: 120 },
  semCard: {
    marginBottom: Spacing.lg,
  },
  semHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  semInfo: { flex: 1 },
  semTitle: { fontSize: 17, fontWeight: '800' },
  semDate: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  semActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyContainer: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
  emptyText: { marginTop: Spacing.sm, fontSize: 14, fontWeight: '500' },
  fabContainer: {
    position: 'absolute',
    bottom: Spacing.md + 50, // Added padding so it doesn't overlap with the ad
    left: Spacing.lg,
    right: Spacing.lg,
  },
  fab: {
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
});
