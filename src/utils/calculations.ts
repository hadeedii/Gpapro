export interface Subject {
  name: string;
  credit: number;
  grade: string;
}

export interface Semester {
  id: number;
  sgpa: number;
  totalCredits: number;
  subjects: Subject[];
  date: string;
}

export function calculateSGPA(subjects: Subject[], gradingTable: Record<string, number>): number {
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach(sub => {
    const gp = gradingTable[sub.grade] ?? 0;
    totalPoints += gp * sub.credit;
    totalCredits += sub.credit;
  });

  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}

export function calculateCGPA(semesters: Semester[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  semesters.forEach(sem => {
    totalPoints += sem.sgpa * sem.totalCredits;
    totalCredits += sem.totalCredits;
  });

  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}
