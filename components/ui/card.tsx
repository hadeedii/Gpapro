import React from 'react';
import { StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    animate?: boolean;
    delay?: number;
}

export const Card: React.FC<CardProps> = ({ children, style, animate = true, delay = 0 }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    // @ts-ignore
    const backgroundColor = themeColors.glassBackground;
    // @ts-ignore
    const borderColor = themeColors.glassBorder;
    // @ts-ignore
    const shadowColor = themeColors.shadowColor;

    return (
        <Animated.View
            entering={animate ? FadeInDown.delay(delay).duration(600).springify().damping(12) : undefined}
            style={[
                styles.glassContainer,
                { backgroundColor, borderColor, shadowColor },
                style
            ]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    glassContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 5,
    },
});
