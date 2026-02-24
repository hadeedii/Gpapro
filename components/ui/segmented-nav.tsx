import React from 'react';
import { View, StyleSheet, Text, Pressable, useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface SegmentedNavProps {
    options: { label?: string, icon?: string, id: string }[];
    activeId: string;
    onSelect: (id: string) => void;
}

export const SegmentedNav: React.FC<SegmentedNavProps> = ({ options, activeId, onSelect }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.5)' }]}>
            {options.map((option) => {
                const isActive = option.id === activeId;
                return (
                    <Pressable
                        key={option.id}
                        onPress={() => onSelect(option.id)}
                        style={[
                            styles.item,
                            isActive && [
                                styles.activeItem,
                                {
                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                    borderColor: 'rgba(255,255,255,0.8)'
                                }
                            ]
                        ]}
                    >
                        <View style={styles.content}>
                            {option.icon && (
                                <IconSymbol
                                    name={option.icon as any}
                                    size={18}
                                    color={isActive ? themeColors.text : themeColors.secondary}
                                />
                            )}
                            {option.label && (
                                <Text style={[
                                    styles.label,
                                    { color: isActive ? themeColors.text : themeColors.secondary }
                                ]}>
                                    {option.label}
                                </Text>
                            )}
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: BorderRadius.lg,
        alignSelf: 'flex-start',
        borderWidth: 1.5,
    },
    item: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 8,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 48,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeItem: {
        borderWidth: 1,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    label: {
        fontSize: 13,
        fontWeight: '800',
    },
});
