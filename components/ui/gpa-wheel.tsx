import React from 'react';
import { View, StyleSheet, Text, useColorScheme } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors, Spacing, Shadows, BorderRadius } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface GpaWheelProps {
    value: number; // 0 to 4.0
    size?: number;
}

export const GpaWheel: React.FC<GpaWheelProps> = ({ value, size = 200 }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const radius = (size - 40) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 4.0) * 100;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // @ts-ignore
    const shadowLight = themeColors.shadowLight;
    // @ts-ignore
    const shadowDark = themeColors.shadowDark;
    // @ts-ignore
    const accentColor = themeColors.accent;

    return (
        <View style={styles.container}>
            {/* Outer Neumorphic Frame */}
            <View style={[
                styles.outerShadow,
                { width: size, height: size, borderRadius: size / 2, shadowColor: shadowLight }
            ]}>
                <View style={[
                    styles.innerShadow,
                    { width: size, height: size, borderRadius: size / 2, shadowColor: shadowDark, backgroundColor: themeColors.background }
                ]}>
                    <View style={[styles.groove, { borderColor: 'rgba(0,0,0,0.03)', borderWidth: 10 }]}>
                        <Svg width={size} height={size} style={styles.svg}>
                            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                                {/* Background Track */}
                                <Circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke="rgba(0,0,0,0.02)"
                                    strokeWidth="15"
                                    fill="none"
                                />
                                {/* Progress Fill */}
                                <Circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke={accentColor}
                                    strokeWidth="15"
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </G>
                        </Svg>

                        {/* Central Red Node (Recessed) */}
                        <View style={[styles.centerNodeOuter, { shadowColor: shadowDark }]}>
                            <View style={[styles.centerNodeInner, { shadowColor: shadowLight, backgroundColor: themeColors.primary }]}>
                                <IconSymbol name="arrow.up.right" size={24} color="#FFF" />
                            </View>
                        </View>

                        {/* Value Overlay */}
                        <View style={styles.textContainer}>
                            <Text style={[styles.valueText, { color: themeColors.text }]}>{value.toFixed(2)}</Text>
                            <Text style={[styles.labelText, { color: themeColors.muted }]}>TOTAL GPA</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerShadow: {
        shadowOffset: { width: -8, height: -8 },
        shadowOpacity: 1,
        shadowRadius: 12,
    },
    innerShadow: {
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groove: {
        width: '90%',
        height: '90%',
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    svg: {
        position: 'absolute',
    },
    centerNodeOuter: {
        width: 54,
        height: 54,
        borderRadius: 27,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    centerNodeInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: -3, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    textContainer: {
        position: 'absolute',
        bottom: -Spacing.xxl,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 28,
        fontWeight: '900',
    },
    labelText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginTop: 2,
    },
});
