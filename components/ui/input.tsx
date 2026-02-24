import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, ViewStyle, useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric';
    style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    style
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: themeColors.muted }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                        borderColor: isFocused ? themeColors.tint : themeColors.border,
                        color: themeColors.text
                    },
                    isFocused && styles.inputFocused
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={themeColors.muted}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: Spacing.xs,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        height: 52,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        fontSize: 16,
        fontWeight: '500',
        borderWidth: 1.5,
    },
    inputFocused: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
});
