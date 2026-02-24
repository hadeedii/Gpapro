import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'error' | 'success' | 'info';
}

export function CustomAlert({
    visible,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = 'Got it',
    cancelText = 'Cancel',
    type = 'info'
}: CustomAlertProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const getBadgeConfig = () => {
        switch (type) {
            case 'error': return { color: themeColors.error, bg: themeColors.error + '20', icon: 'xmark' as const };
            case 'success': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', icon: 'checkmark' as const };
            default: return { color: themeColors.tint, bg: themeColors.tint + '20', icon: 'info.circle.fill' as const };
        }
    };

    const config = getBadgeConfig();
    const isConfirmation = !!onConfirm;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={StyleSheet.absoluteFill}>
                    <Pressable style={styles.backdrop} onPress={onClose} />
                </View>

                <View style={[styles.container, { borderColor: themeColors.glassBorder }]}>
                    <BlurView intensity={100} tint="light" style={[styles.glass, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
                        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
                            <IconSymbol name={config.icon as any} size={32} color={config.color} />
                        </View>

                        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
                        <Text style={[styles.message, { color: themeColors.muted }]}>{message}</Text>

                        <View style={isConfirmation ? styles.row : styles.stack}>
                            {isConfirmation && (
                                <Pressable
                                    onPress={onClose}
                                    style={({ pressed }) => [
                                        styles.button,
                                        styles.secondaryButton,
                                        { backgroundColor: themeColors.glassBackground, borderColor: themeColors.glassBorder },
                                        pressed && { opacity: 0.7 }
                                    ]}
                                >
                                    <Text style={[styles.buttonText, { color: themeColors.text }]}>{cancelText}</Text>
                                </Pressable>
                            )}

                            <Pressable
                                onPress={onConfirm || onClose}
                                style={({ pressed }) => [
                                    styles.button,
                                    { backgroundColor: type === 'error' ? themeColors.error : themeColors.tint },
                                    isConfirmation && { flex: 1 },
                                    pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                                ]}
                            >
                                <Text style={styles.primaryButtonText}>{onConfirm ? confirmText : 'Got it'}</Text>
                            </Pressable>
                        </View>
                    </BlurView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        ...Shadows.lg,
    },
    glass: {
        padding: Spacing.xl,
        paddingVertical: Spacing.xxl,
        alignItems: 'center',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: Spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        marginBottom: Spacing.xl,
    },
    stack: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
        width: '100%',
    },
    button: {
        height: 52,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    }
});
