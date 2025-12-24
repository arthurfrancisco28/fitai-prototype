// Utilitários para Local Storage
import { Meal, UserGoals, UserProfile, QuizAnswers } from './types';

const MEALS_KEY = 'fitai_meals';
const GOALS_KEY = 'fitai_goals';
const PROFILE_KEY = 'fitai_profile';

// Metas padrão
const DEFAULT_GOALS: UserGoals = {
  caloriesGoal: 2000,
  proteinGoal: 150,
  carbsGoal: 250,
  fatGoal: 65,
};

export const storage = {
  // Refeições
  getMeals: (): Meal[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(MEALS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMeal: (meal: Meal): void => {
    if (typeof window === 'undefined') return;
    const meals = storage.getMeals();
    meals.unshift(meal);
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  },

  deleteMeal: (id: string): void => {
    if (typeof window === 'undefined') return;
    const meals = storage.getMeals().filter(m => m.id !== id);
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  },

  getTodayMeals: (): Meal[] => {
    const meals = storage.getMeals();
    const today = new Date().toDateString();
    return meals.filter(m => new Date(m.timestamp).toDateString() === today);
  },

  // Metas
  getGoals: (): UserGoals => {
    if (typeof window === 'undefined') return DEFAULT_GOALS;
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : DEFAULT_GOALS;
  },

  saveGoals: (goals: UserGoals): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  },

  // Perfil do Usuário (Quiz)
  getUserProfile: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUserProfile: (profile: UserProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    
    // Atualizar metas baseado no perfil
    const goals: UserGoals = {
      caloriesGoal: profile.estimatedCalories,
      proteinGoal: Math.round(profile.estimatedCalories * 0.3 / 4), // 30% das calorias
      carbsGoal: Math.round(profile.estimatedCalories * 0.4 / 4), // 40% das calorias
      fatGoal: Math.round(profile.estimatedCalories * 0.3 / 9), // 30% das calorias
    };
    storage.saveGoals(goals);
  },

  hasCompletedQuiz: (): boolean => {
    const profile = storage.getUserProfile();
    return profile?.completedQuiz || false;
  },
};
