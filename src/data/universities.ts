export interface University {
  name: string;
  grading: 'Type1' | 'Type2';
  province: string;
}

export const universities: University[] = [
  // Punjab - Public
  { name: 'University of the Punjab', grading: 'Type1', province: 'Punjab' },
  { name: 'Government College University Lahore', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Agriculture Faisalabad', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Engineering and Technology Lahore', grading: 'Type1', province: 'Punjab' },
  { name: 'Bahauddin Zakariya University', grading: 'Type1', province: 'Punjab' },
  { name: 'Islamia University of Bahawalpur', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Gujrat', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Sargodha', grading: 'Type1', province: 'Punjab' },
  { name: 'Government College University Faisalabad', grading: 'Type1', province: 'Punjab' },
  { name: 'Fatima Jinnah Women University', grading: 'Type1', province: 'Punjab' },
  { name: 'Lahore College for Women University', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Okara', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Narowal', grading: 'Type1', province: 'Punjab' },

  // Punjab - Private
  { name: 'Lahore University of Management Sciences (LUMS)', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Central Punjab (UCP)', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Management and Technology (UMT)', grading: 'Type1', province: 'Punjab' },
  { name: 'University of Lahore (UoL)', grading: 'Type1', province: 'Punjab' },
  { name: 'Superior University', grading: 'Type1', province: 'Punjab' },
  { name: 'Riphah International University', grading: 'Type1', province: 'Punjab' },

  // ICT
  { name: 'National University of Sciences and Technology (NUST)', grading: 'Type1', province: 'ICT' },
  { name: 'Quaid-i-Azam University', grading: 'Type1', province: 'ICT' },
  { name: 'International Islamic University Islamabad', grading: 'Type1', province: 'ICT' },
  { name: 'COMSATS University Islamabad', grading: 'Type1', province: 'ICT' },
  { name: 'Allama Iqbal Open University', grading: 'Type1', province: 'ICT' },
  { name: 'Bahria University', grading: 'Type1', province: 'ICT' },
  { name: 'Air University', grading: 'Type1', province: 'ICT' },

  // Sindh
  { name: 'University of Karachi', grading: 'Type1', province: 'Sindh' },
  { name: 'NED University of Engineering and Technology', grading: 'Type1', province: 'Sindh' },
  { name: 'Institute of Business Administration (IBA) Karachi', grading: 'Type1', province: 'Sindh' },
  { name: 'Dow University of Health Sciences', grading: 'Type1', province: 'Sindh' },
  { name: 'Shaheed Benazir Bhutto University', grading: 'Type1', province: 'Sindh' },
  { name: 'Sukkur IBA University', grading: 'Type1', province: 'Sindh' },

  // KPK
  { name: 'University of Peshawar', grading: 'Type1', province: 'KPK' },
  { name: 'University of Engineering and Technology Peshawar', grading: 'Type1', province: 'KPK' },
  { name: 'Abdul Wali Khan University Mardan', grading: 'Type1', province: 'KPK' },
  { name: 'University of Swat', grading: 'Type1', province: 'KPK' },
  { name: 'Hazara University', grading: 'Type1', province: 'KPK' },

  // Balochistan
  { name: 'University of Balochistan', grading: 'Type1', province: 'Balochistan' },
  { name: 'BUITEMS', grading: 'Type1', province: 'Balochistan' },
  { name: 'Sardar Bahadur Khan Women University', grading: 'Type1', province: 'Balochistan' },

  // AJK
  { name: 'University of Azad Jammu and Kashmir', grading: 'Type1', province: 'AJK' },
  { name: 'Mirpur University of Science and Technology (MUST)', grading: 'Type1', province: 'AJK' },

  // GB
  { name: 'University of Baltistan', grading: 'Type1', province: 'GB' },
  { name: 'Karakoram International University', grading: 'Type1', province: 'GB' },
];
