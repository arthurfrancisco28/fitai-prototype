// Tipos para o FitAi Pro

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
  imageUrl?: string;
  method: 'photo' | 'barcode' | 'voice' | 'manual';
}

export interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

export interface UserGoals {
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

// Tipos para o Quiz
export interface QuizAnswers {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  targetWeight: number; // Peso desejado
  height: number;
  dietRoutine: 'very_irregular' | 'somewhat' | 'relatively_healthy' | 'very_healthy';
  mealsPerDay: '1-2' | '3' | '4-5' | '5+';
  mainDifficulty: 'dont_know' | 'no_time' | 'compulsion' | 'no_results' | 'inconsistency';
  mainGoal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_diet';
  aiInterest: 'yes' | 'maybe' | 'not_much';
}

export interface UserProfile extends QuizAnswers {
  estimatedCalories: number;
  completedQuiz: boolean;
  quizCompletedAt: number;
  weightDifference: number; // Diferença entre peso atual e desejado
  goalType: 'weight_loss' | 'weight_gain' | 'maintenance'; // Tipo de objetivo baseado na diferença
}
