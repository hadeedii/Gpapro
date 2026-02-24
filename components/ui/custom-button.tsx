import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const CustomButton: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled,
    style,
    textStyle
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const scale = useSharedValue(1);

    // @ts-ignore
    const backgroundColor = disabled ? 'rgba(255,255,255,0.2)' : themeColors.glassBackground;
    // @ts-ignore
    const borderColor = themeColors.glassBorder;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(scale.value, { damping: 10, stiffness: 200 }) }]
    }));

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => (scale.value = 0.96)}
            onPressOut={() => (scale.value = 1)}
            disabled={disabled}
            style={[{ width: '100%', alignItems: 'center' }, style]}
        >
            <Animated.View
                style={[
                    styles.button,
                    { backgroundColor, borderColor },
                    animatedStyle,
                    { width: '100%' }
                ]}
            >
                <Text style={[styles.text, { color: themeColors.text }, textStyle]}>{title}</Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
