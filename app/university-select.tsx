import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { universities, University } from '@/src/data/universities';
import { saveData, AppData } from '@/src/utils/storage';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Dropdown } from '@/components/ui/dropdown';
import { CustomButton } from '@/components/ui/custom-button';
import Animated, { FadeInDown, ZoomIn, FadeInUp } from 'react-native-reanimated';

export default function UniversitySelect() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [selectedUnivName, setSelectedUnivName] = useState<string>('');

  const universityOptions = useMemo(() => {
    return universities.map(u => ({
      label: u.name,
      value: u.name
    }));
  }, []);

  const handleContinue = async () => {
    const uni = universities.find(u => u.name === selectedUnivName);
    if (!uni) return;

    const data: AppData = {
      university: uni.name,
      gradingType: uni.grading,
      semesters: [],
      cgpa: 0
    };
    await saveData(data);
    router.replace('/dashboard');
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#E2E8F0', '#F7FAFC']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Animated.View
                entering={ZoomIn.duration(800).springify()}
                style={styles.logoIcon}
              >
                <Image
                  source={require('../assets/images/icon.png')}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.Text
                entering={FadeInDown.delay(200).duration(600)}
                style={[styles.title, { color: themeColors.text }]}
              >
                Welcome to GPAPro
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(300).duration(700)}
                style={[styles.subtitle, { color: themeColors.secondary }]}
              >
                Select your university to personalize your academic experience.
              </Animated.Text>
            </View>

            <Card delay={500} style={styles.selectionCard}>
              <Dropdown
                label="Choose University"
                placeholder="Find your university..."
                value={selectedUnivName}
                options={universityOptions}
                onSelect={setSelectedUnivName}
                style={styles.dropdown}
              />

              <View style={styles.infoBox}>
                <IconSymbol name="checkmark" size={16} color={themeColors.secondary} />
                <Text style={[styles.infoText, { color: themeColors.secondary }]}>
                  We'll automatically configure the grading system used by your university.
                </Text>
              </View>
            </Card>
          </ScrollView>

          <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.footer}>
            <CustomButton
              title="Get Started"
              onPress={handleContinue}
              disabled={!selectedUnivName}
              style={styles.continueBtn}
            />
            <Text style={[styles.footerNote, { color: themeColors.secondary }]}>
              Don't see your university? Contact Support
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: Spacing.lg },
  scrollContent: { paddingVertical: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xl * 2, marginTop: Spacing.xl },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', textAlign: 'center', paddingHorizontal: Spacing.xl, lineHeight: 22 },
  selectionCard: {
    padding: Spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dropdown: { marginBottom: Spacing.lg },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: 4,
    opacity: 0.8,
  },
  infoText: { fontSize: 13, flex: 1, lineHeight: 18, fontWeight: '500' },
  footer: { paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl, gap: Spacing.md },
  continueBtn: { width: '100%' },
  footerNote: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
