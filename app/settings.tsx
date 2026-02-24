import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { loadData, saveData, AppData } from '@/src/utils/storage';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/ui/dropdown';
import { CustomButton } from '@/components/ui/custom-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';

const DEGREE_OPTIONS = [
    { label: 'Associate Degree', value: 'Associate' },
    { label: 'Bachelor (BS)', value: 'BS' },
    { label: 'Master (MS/MPhil)', value: 'MS' },
    { label: 'Doctorate (PhD)', value: 'PhD' },
];

export default function SettingsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const [data, setData] = useState<AppData | null>(null);
    const [degreeType, setDegreeType] = useState('BS');
    const [major, setMajor] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadData().then(d => {
            if (d) {
                setData(d);
                setDegreeType(d.degreeType || 'BS');
                setMajor(d.major || '');
            }
        });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        const newData: AppData = {
            ...data,
            degreeType,
            major
        };
        await saveData(newData);
        setShowSuccess(true);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.back();
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
                    style={{ flex: 1 }}
                >
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
                        </Pressable>
                        <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Card style={styles.sectionCard}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Academic Profile</Text>

                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: themeColors.secondary }]}>University</Text>
                                <Pressable
                                    onPress={() => router.push('/university-select')}
                                    style={[styles.uniDisplay, { backgroundColor: themeColors.tint + '08' }]}
                                >
                                    <Text style={[styles.uniName, { color: themeColors.text }]}>{data?.university || 'Select University'}</Text>
                                    <IconSymbol name="pencil" size={16} color={themeColors.tint} />
                                </Pressable>
                            </View>

                            <View style={styles.field}>
                                <Text style={[styles.label, { color: themeColors.secondary }]}>Degree Type</Text>
                                <Dropdown
                                    value={degreeType}
                                    options={DEGREE_OPTIONS}
                                    onSelect={setDegreeType}
                                />
                            </View>

                            <View style={styles.field}>
                                <Text style={[styles.label, { color: themeColors.secondary }]}>Major / Department</Text>
                                <Input
                                    placeholder="e.g. Computer Science"
                                    value={major}
                                    onChangeText={setMajor}
                                />
                            </View>
                        </Card>

                        <View style={styles.infoBox}>
                            <IconSymbol name="doc.text" size={20} color={themeColors.secondary} />
                            <Text style={[styles.infoText, { color: themeColors.secondary }]}>
                                Changing university will allow you to reconfigure your grading system and semester structure.
                            </Text>
                        </View>

                        <View style={styles.portfolioContainer}>
                            <Pressable
                                onPress={() => Linking.openURL('https://hudaidajmalportfolio.netlify.app')}
                                style={({ pressed }) => [
                                    styles.portfolioGradientBtn,
                                    pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
                                ]}
                            >
                                <LinearGradient
                                    colors={['#065F46', '#047857']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientInside}
                                >
                                    <Text style={styles.portfolioGradientText}>Contact Developer</Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <CustomButton
                            title="Save Changes"
                            onPress={handleSave}
                            style={styles.saveBtn}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <CustomAlert
                visible={showSuccess}
                title="Settings Updated"
                message="Your academic profile has been successfully updated."
                type="success"
                onClose={handleSuccessClose}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { fontSize: 24, fontWeight: '900' },
    scrollContent: { padding: Spacing.lg },
    sectionCard: {
        padding: Spacing.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: Spacing.xl,
    },
    field: { marginBottom: Spacing.lg },
    label: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoRow: { marginBottom: Spacing.xl },
    uniDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.xs,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    uniName: { fontSize: 16, fontWeight: '700', flex: 1, marginRight: Spacing.md },
    infoBox: {
        flexDirection: 'row',
        padding: Spacing.lg,
        gap: Spacing.sm,
        marginTop: Spacing.md,
        opacity: 0.8,
    },
    infoText: { fontSize: 13, flex: 1, lineHeight: 18 },
    portfolioContainer: {
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    portfolioGradientBtn: {
        width: '50%',
        height: 52,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
        shadowColor: '#065F46',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientInside: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    portfolioGradientText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    footer: { padding: Spacing.lg, paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl },
    saveBtn: {
        width: '100%',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
});
