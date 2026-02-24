import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface DropdownProps {
    label?: string;
    value: string;
    options: string[] | { label: string; value: string }[];
    onSelect: (value: string) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onSelect, placeholder, style }) => {
    const [visible, setVisible] = React.useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const data = typeof options[0] === 'string'
        ? (options as string[]).map(o => ({ label: o, value: o }))
        : options as { label: string; value: string }[];

    const selectedLabel = data.find(d => d.value === value)?.label || placeholder || 'Select...';

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>}
            <Pressable
                onPress={() => setVisible(true)}
                style={[
                    styles.trigger,
                    {
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderColor: 'rgba(255,255,255,0.5)'
                    }
                ]}
            >
                <Text style={[styles.triggerText, { color: value ? themeColors.text : themeColors.secondary }]}>
                    {selectedLabel}
                </Text>
                <IconSymbol name="chevron.down" size={18} color={themeColors.secondary} />
            </Pressable>

            <Modal visible={visible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={[styles.modalContent, { backgroundColor: 'white', borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.05)' }, Shadows.xl]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalBar} />
                        </View>
                        <FlatList
                            data={data}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item.value);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        { color: item.value === value ? themeColors.tint : themeColors.text },
                                        item.value === value && { fontWeight: '800' }
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {item.value === value && (
                                        <IconSymbol name="checkmark" size={18} color={themeColors.tint} />
                                    )}
                                </Pressable>
                            )}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    trigger: {
        height: 52,
        borderWidth: 1.5,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    triggerText: {
        fontSize: 15,
        fontWeight: '600',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        maxHeight: '60%',
        borderTopLeftRadius: BorderRadius.xl * 1.5,
        borderTopRightRadius: BorderRadius.xl * 1.5,
        padding: Spacing.sm,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    option: {
        padding: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
