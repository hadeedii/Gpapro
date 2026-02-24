import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { loadData } from '@/src/utils/storage';
import { Colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    (async () => {
      // Simulate a bit of splash time for branding
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await loadData();
      if (data && data.university) {
        router.replace('/dashboard');
      } else {
        router.replace('/university-select');
      }
      setLoading(false);
    })();
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  icon: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});
