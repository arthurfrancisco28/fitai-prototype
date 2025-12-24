// Calculadora de calorias baseada em TMB (Taxa Metabólica Basal)
import { QuizAnswers } from './types';

export function calculateDailyCalories(answers: QuizAnswers): number {
  const { age, gender, weight, height, mainGoal, targetWeight } = answers;

  // Calcular diferença de peso
  const weightDifference = weight - targetWeight;

  // Fórmula de Harris-Benedict revisada
  let tmb: number;
  
  if (gender === 'male') {
    // TMB Homens = 88,362 + (13,397 × peso em kg) + (4,799 × altura em cm) - (5,677 × idade em anos)
    tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    // TMB Mulheres = 447,593 + (9,247 × peso em kg) + (3,098 × altura em cm) - (4,330 × idade em anos)
    tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Fator de atividade (assumindo sedentário a levemente ativo)
  const activityFactor = 1.4; // Leve atividade
  let dailyCalories = tmb * activityFactor;

  // Ajuste baseado no objetivo E na diferença de peso
  // Se a diferença de peso for significativa, ajustar mais agressivamente
  const isSignificantWeightLoss = weightDifference > 5; // Mais de 5kg para perder
  const isSignificantWeightGain = weightDifference < -5; // Mais de 5kg para ganhar
  
  switch (mainGoal) {
    case 'lose_weight':
      // Déficit calórico baseado na meta
      if (isSignificantWeightLoss) {
        dailyCalories = dailyCalories * 0.80; // Déficit de 20% para perda significativa
      } else {
        dailyCalories = dailyCalories * 0.85; // Déficit de 15% para perda moderada
      }
      break;
    case 'gain_muscle':
      // Superávit calórico baseado na meta
      if (isSignificantWeightGain) {
        dailyCalories = dailyCalories * 1.20; // Superávit de 20% para ganho significativo
      } else {
        dailyCalories = dailyCalories * 1.15; // Superávit de 15% para ganho moderado
      }
      break;
    case 'maintain':
      // Manter calorias de manutenção
      // Se peso atual está próximo do desejado, manter
      if (Math.abs(weightDifference) <= 2) {
        dailyCalories = dailyCalories * 1.0;
      } else if (weightDifference > 0) {
        // Precisa perder um pouco
        dailyCalories = dailyCalories * 0.90;
      } else {
        // Precisa ganhar um pouco
        dailyCalories = dailyCalories * 1.10;
      }
      break;
    case 'improve_diet':
      // Ajustar levemente baseado na diferença de peso
      if (Math.abs(weightDifference) <= 2) {
        dailyCalories = dailyCalories * 1.0;
      } else if (weightDifference > 0) {
        dailyCalories = dailyCalories * 0.95;
      } else {
        dailyCalories = dailyCalories * 1.05;
      }
      break;
  }

  // Arredondar para múltiplo de 50
  return Math.round(dailyCalories / 50) * 50;
}

// Função auxiliar para determinar o tipo de objetivo baseado na diferença de peso
export function determineGoalType(weight: number, targetWeight: number): 'weight_loss' | 'weight_gain' | 'maintenance' {
  const difference = weight - targetWeight;
  
  if (difference > 2) {
    return 'weight_loss';
  } else if (difference < -2) {
    return 'weight_gain';
  } else {
    return 'maintenance';
  }
}

// Função para calcular intensidade recomendada baseada na diferença de peso
export function calculateIntensity(weight: number, targetWeight: number): 'low' | 'moderate' | 'high' {
  const difference = Math.abs(weight - targetWeight);
  
  if (difference <= 3) {
    return 'low';
  } else if (difference <= 10) {
    return 'moderate';
  } else {
    return 'high';
  }
}
