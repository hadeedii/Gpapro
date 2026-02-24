import AsyncStorage from '@react-native-async-storage/async-storage';
import { Semester } from './calculations';

export interface AppData {
  university: string;
  gradingType: 'Type1' | 'Type2';
  degreeType?: string; // MS, BS, PhD
  major?: string; // CS, Literature, etc.
  cgpa: number;
  semesters: Semester[];
}

const STORAGE_KEY = '@future_data';

export const saveData = async (data: AppData): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadData = async (): Promise<AppData | null> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as AppData) : null;
};
