import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { loadData, saveData, AppData } from '@/src/utils/storage';
import { calculateSGPA, calculateCGPA, Subject, Semester } from '@/src/utils/calculations';
import { gradingType1, gradingType2 } from '@/src/utils/gradingTables';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/ui/dropdown';
import { CustomButton } from '@/components/ui/custom-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';

const EMPTY_SUBJECT: Subject = { name: '', credit: 0, grade: 'A' };

export default function SGPA() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const [data, setData] = useState<AppData | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([{ ...EMPTY_SUBJECT }]);
  const [gradeTable, setGradeTable] = useState<Record<string, number>>({});
  const [calculated, setCalculated] = useState<number>(0);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertConfig({ visible: true, title, message, type });
  };

  useEffect(() => {
    (async () => {
      const d = await loadData();
      if (d) {
        setData(d);
        const table = d.gradingType === 'Type1' ? gradingType1 : gradingType2;
        setGradeTable(table);

        if (isEditing) {
          const semester = d.semesters.find(s => s.id === Number(id));
          if (semester) {
            // We need to ensure subjects are stored. If not, start with empty.
            setSubjects(semester.subjects || [{ ...EMPTY_SUBJECT }]);
            setCalculated(semester.sgpa);
          }
        }
      }
    })();
  }, [id, isEditing]);

  // Auto-calculation
  useEffect(() => {
    if (Object.keys(gradeTable).length > 0) {
      const sgpa = calculateSGPA(subjects, gradeTable);
      setCalculated(sgpa);
    }
  }, [subjects, gradeTable]);

  const updateSubject = (index: number, field: keyof Subject, value: string | number) => {
    setSubjects(prev => {
      const copy = [...prev];
      // @ts-ignore
      copy[index][field] = value;
      return copy;
    });
  };

  const addSubject = () => {
    const lastSubject = subjects[subjects.length - 1];
    if (!lastSubject.name.trim()) {
      showAlert("Missing Name", `Please enter a name for Subject ${subjects.length}`);
      return;
    }
    if (lastSubject.credit <= 0) {
      showAlert("Invalid Credits", `Please enter valid credit hours for Subject ${subjects.length}`);
      return;
    }
    setSubjects(prev => [...prev, { ...EMPTY_SUBJECT }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length === 1) {
      setSubjects([{ ...EMPTY_SUBJECT }]);
      return;
    }
    setSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const saveSemester = async () => {
    if (!data) return;

    // Validation
    for (let i = 0; i < subjects.length; i++) {
      if (!subjects[i].name.trim()) {
        showAlert("Missing Information", `Please enter a name for Subject ${i + 1}`);
        return;
      }
      if (subjects[i].credit <= 0) {
        showAlert("Missing Information", `Please enter valid credit hours for Subject ${i + 1}`);
        return;
      }
    }

    const sgpa = calculated;
    const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);

    let updatedSemesters: Semester[];

    if (isEditing) {
      updatedSemesters = data.semesters.map(s => {
        if (s.id === Number(id)) {
          return {
            ...s,
            sgpa,
            totalCredits,
            subjects,
            date: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      });
    } else {
      const newSemester: Semester = {
        id: data.semesters.length > 0 ? Math.max(...data.semesters.map(s => s.id)) + 1 : 1,
        sgpa,
        totalCredits,
        subjects,
        date: new Date().toISOString().split('T')[0],
      };
      updatedSemesters = [...data.semesters, newSemester];
    }

    const updated = {
      ...data,
      semesters: updatedSemesters,
      cgpa: calculateCGPA(updatedSemesters),
    };

    await saveData(updated);
    router.replace('/dashboard');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#E2E8F0', '#F7FAFC']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
          </Pressable>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {isEditing ? 'Edit Semester' : 'SGPA Calculator'}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(600).springify()}
          style={styles.keyboardView}
        >
          <Animated.FlatList
            data={subjects}
            keyExtractor={(_, index) => index.toString()}
            itemLayoutAnimation={LinearTransition}
            renderItem={({ item, index }) => (
              <Card delay={400 + index * 100} style={styles.subjectCard}>
                <View style={styles.subjectRow}>
                  <View style={[styles.badge, { backgroundColor: themeColors.tint + '15' }]}>
                    <Text style={[styles.badgeText, { color: themeColors.tint }]}>{index + 1}</Text>
                  </View>
                  <Input
                    placeholder="Subject Name"
                    value={item.name}
                    onChangeText={(val) => updateSubject(index, 'name', val)}
                    style={styles.nameInput}
                  />
                  <Pressable onPress={() => removeSubject(index)} style={styles.removeBtn}>
                    <IconSymbol name="trash" size={18} color={themeColors.error} />
                  </Pressable>
                </View>

                <View style={[styles.row, { gap: Spacing.md }]}>
                  <View style={{ flex: 1 }}>
                    <Input
                      placeholder="Credits"
                      value={item.credit ? item.credit.toString() : ''}
                      keyboardType="numeric"
                      onChangeText={(val) => updateSubject(index, 'credit', Number(val))}
                      style={styles.compactInput}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Dropdown
                      value={item.grade}
                      options={Object.keys(gradeTable)}
                      onSelect={(val) => updateSubject(index, 'grade', val)}
                      style={styles.compactDropdown}
                    />
                  </View>
                </View>
              </Card>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                <CustomButton
                  title="Add Another Subject"
                  onPress={addSubject}
                  style={styles.addBtn}
                />
              </Animated.View>
            }
          />

          <View style={[styles.bottomSection, { backgroundColor: themeColors.background }]}>
            <Card style={styles.resultCard}>
              <View style={styles.resultRow}>
                <View>
                  <Text style={[styles.resultLabel, { color: themeColors.tint }]}>PROJECTION</Text>
                  <Text style={[styles.resultValue, { color: themeColors.text }]}>{calculated.toFixed(2)} SGPA</Text>
                </View>
                <View style={[styles.saveIcon, { backgroundColor: themeColors.tint }]}>
                  <IconSymbol name="star.fill" size={20} color="#FFF" />
                </View>
              </View>
            </Card>
            <CustomButton
              title={isEditing ? "Update Semester" : "Complete Semester"}
              onPress={saveSemester}
              style={styles.completeBtn}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    padding: 6,
    marginLeft: -4,
    borderRadius: BorderRadius.full,
  },
  title: { fontSize: 22, fontWeight: '900', flex: 1, textAlign: 'center' },
  listContent: { padding: Spacing.lg, paddingBottom: 220 },
  keyboardView: { flex: 1 },
  subjectCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '800' },
  removeBtn: { padding: 6, opacity: 0.7 },
  row: { flexDirection: 'row' },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  nameInput: {
    flex: 1,
    marginBottom: 0,
  },
  compactInput: {
    height: 44,
    marginBottom: 0,
    fontSize: 13,
  },
  compactDropdown: {
    marginBottom: 0,
  },
  addBtn: { width: '100%', borderStyle: 'dashed' },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
    // Style blend via LinearGradient in component
  },
  resultCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  resultValue: { fontSize: 26, fontWeight: '900', marginTop: 4 },
  saveIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeBtn: {
    width: '100%',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
