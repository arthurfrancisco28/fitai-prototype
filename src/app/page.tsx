'use client';

import { useState, useEffect } from 'react';
import { Camera, Barcode, Mic, Trash2, TrendingUp, Apple, UtensilsCrossed, Lightbulb } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Meal, UserGoals } from '@/lib/types';
import QuizFunnel from '@/components/QuizFunnel';

// Sistema de dicas que muda diariamente
const dailyTips = [
  // Dia 1
  [
    'Beba pelo menos 2 litros de água por dia para manter seu corpo hidratado e acelerar o metabolismo.',
    'Inclua proteínas em todas as refeições para manter a saciedade e preservar a massa muscular.',
    'Durma de 7 a 9 horas por noite - o sono adequado é essencial para a recuperação muscular e controle do apetite.'
  ],
  // Dia 2
  [
    'Coma devagar e mastigue bem os alimentos - isso ajuda na digestão e aumenta a sensação de saciedade.',
    'Adicione vegetais coloridos no prato - quanto mais cores, mais nutrientes você está consumindo.',
    'Faça pelo menos 30 minutos de atividade física por dia, mesmo que seja uma caminhada leve.'
  ],
  // Dia 3
  [
    'Evite pular refeições - isso pode desacelerar seu metabolismo e causar compulsão alimentar depois.',
    'Prefira alimentos integrais aos refinados - eles têm mais fibras e mantêm você saciado por mais tempo.',
    'Alongue-se antes e depois dos treinos para prevenir lesões e melhorar sua flexibilidade.'
  ],
  // Dia 4
  [
    'Planeje suas refeições com antecedência - isso evita escolhas impulsivas e pouco saudáveis.',
    'Consuma frutas como lanches entre as refeições principais para manter a energia estável.',
    'Pratique exercícios de força pelo menos 2 vezes por semana para fortalecer músculos e ossos.'
  ],
  // Dia 5
  [
    'Reduza o consumo de alimentos ultraprocessados - priorize comida de verdade sempre que possível.',
    'Tome sol por 15 minutos diariamente para produzir vitamina D naturalmente.',
    'Respire fundo e pratique mindfulness durante as refeições - comer com atenção melhora a digestão.'
  ],
  // Dia 6
  [
    'Varie suas fontes de proteína - frango, peixe, ovos, leguminosas e laticínios são ótimas opções.',
    'Evite bebidas açucaradas - prefira água, chás naturais ou água com gás.',
    'Descanse entre os treinos - o músculo cresce durante o descanso, não durante o exercício.'
  ],
  // Dia 7
  [
    'Coma gorduras boas como abacate, castanhas e azeite - elas são essenciais para a saúde hormonal.',
    'Estabeleça uma rotina de sono regular - dormir e acordar no mesmo horário melhora a qualidade do sono.',
    'Celebre suas pequenas conquistas - cada passo em direção ao seu objetivo merece reconhecimento!'
  ]
];

// Função para obter as dicas do dia baseado na data
const getDailyTips = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (domingo) a 6 (sábado)
  return dailyTips[dayOfWeek];
};

export default function FitAiPro() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<UserGoals>({
    caloriesGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 65,
  });
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState('');

  // Verificar se usuário completou o quiz
  useEffect(() => {
    const hasCompleted = storage.hasCompletedQuiz();
    setShowQuiz(!hasCompleted);
    
    if (hasCompleted) {
      const profile = storage.getUserProfile();
      if (profile) {
        setUserName(profile.name);
      }
      setMeals(storage.getTodayMeals());
      setGoals(storage.getGoals());
    }
  }, []);

  // Calcular totais do dia
  const todayStats = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calcular calorias restantes
  const caloriesRemaining = Math.max(goals.caloriesGoal - todayStats.calories, 0);

  // Calcular percentuais
  const caloriesPercent = Math.min((todayStats.calories / goals.caloriesGoal) * 100, 100);
  const proteinPercent = Math.min((todayStats.protein / goals.proteinGoal) * 100, 100);
  const carbsPercent = Math.min((todayStats.carbs / goals.carbsGoal) * 100, 100);
  const fatPercent = Math.min((todayStats.fat / goals.fatGoal) * 100, 100);

  // Simular escaneamento por foto
  const handlePhotoScan = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: 'Arroz com Feijão',
      type: 'lunch',
      calories: 450,
      protein: 15,
      carbs: 75,
      fat: 8,
      timestamp: Date.now(),
      method: 'photo',
    };
    storage.saveMeal(newMeal);
    setMeals(storage.getTodayMeals());
  };

  // Simular escaneamento por código de barras
  const handleBarcodeScan = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: 'Pão Francês',
      type: 'breakfast',
      calories: 150,
      protein: 5,
      carbs: 30,
      fat: 2,
      timestamp: Date.now(),
      method: 'barcode',
    };
    storage.saveMeal(newMeal);
    setMeals(storage.getTodayMeals());
  };

  // Simular registro por voz
  const handleVoiceLog = () => {
    setIsListening(true);
    setTimeout(() => {
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: 'Frango Grelhado com Salada',
        type: 'dinner',
        calories: 380,
        protein: 45,
        carbs: 20,
        fat: 12,
        timestamp: Date.now(),
        method: 'voice',
      };
      storage.saveMeal(newMeal);
      setMeals(storage.getTodayMeals());
      setIsListening(false);
    }, 2000);
  };

  // Deletar refeição
  const handleDeleteMeal = (id: string) => {
    storage.deleteMeal(id);
    setMeals(storage.getTodayMeals());
  };

  // Formatar tipo de refeição
  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: 'Café da Manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche',
    };
    return labels[type] || type;
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    const profile = storage.getUserProfile();
    if (profile) {
      setUserName(profile.name);
    }
    setMeals(storage.getTodayMeals());
    setGoals(storage.getGoals());
  };

  // Mostrar quiz se não completou
  if (showQuiz) {
    return <QuizFunnel onComplete={handleQuizComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2d3561] to-[#1e2749]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2d3561] to-[#3d4a7a] text-white p-6 shadow-2xl border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Apple className="w-8 h-8 text-cyan-400" />
                <h1 className="text-3xl font-bold text-white">FitAi Pro</h1>
              </div>
              <p className="text-gray-300 text-sm">
                {userName ? `Olá, ${userName}! 👋` : 'Seu controle alimentar inteligente'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Resumo Diário */}
        <section className="bg-gradient-to-br from-[#2a3150] to-[#1f2640] rounded-2xl shadow-2xl p-6 border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Resumo de Hoje</h2>
          </div>

          {/* Calorias Principal com Calorias Restantes */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 mb-6 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calorias Consumidas */}
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-200 mb-1">Calorias Consumidas</p>
                <p className="text-5xl font-bold mb-1">{todayStats.calories}</p>
                <p className="text-sm text-gray-200">de {goals.caloriesGoal} kcal</p>
                <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-cyan-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${caloriesPercent}%` }}
                  />
                </div>
              </div>

              {/* Calorias Restantes */}
              <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/30 pt-4 md:pt-0 md:pl-6">
                <p className="text-sm text-gray-200 mb-1">Calorias Restantes</p>
                <p className="text-5xl font-bold mb-1">{caloriesRemaining}</p>
                <p className="text-sm text-gray-200">kcal disponíveis</p>
                <div className="mt-4 flex items-center justify-center md:justify-end gap-2">
                  {caloriesRemaining > 0 ? (
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      Você ainda pode consumir {caloriesRemaining} kcal hoje
                    </span>
                  ) : (
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      Meta diária atingida! 🎉
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Macronutrientes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Proteínas */}
            <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/20 rounded-xl p-4 border border-blue-400/30 backdrop-blur-sm">
              <p className="text-sm text-cyan-300 font-semibold mb-2">Proteínas</p>
              <p className="text-2xl font-bold text-white mb-1">{todayStats.protein}g</p>
              <p className="text-xs text-gray-300 mb-2">de {goals.proteinGoal}g</p>
              <div className="bg-blue-900/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Carboidratos */}
            <div className="bg-gradient-to-br from-emerald-600/30 to-emerald-700/20 rounded-xl p-4 border border-emerald-400/30 backdrop-blur-sm">
              <p className="text-sm text-emerald-300 font-semibold mb-2">Carboidratos</p>
              <p className="text-2xl font-bold text-white mb-1">{todayStats.carbs}g</p>
              <p className="text-xs text-gray-300 mb-2">de {goals.carbsGoal}g</p>
              <div className="bg-emerald-900/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>

            {/* Gorduras */}
            <div className="bg-gradient-to-br from-orange-600/30 to-orange-700/20 rounded-xl p-4 border border-orange-400/30 backdrop-blur-sm">
              <p className="text-sm text-orange-300 font-semibold mb-2">Gorduras</p>
              <p className="text-2xl font-bold text-white mb-1">{todayStats.fat}g</p>
              <p className="text-xs text-gray-300 mb-2">de {goals.fatGoal}g</p>
              <div className="bg-orange-900/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Botões de Ação */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handlePhotoScan}
            className="bg-gradient-to-br from-[#2a3150] to-[#1f2640] hover:from-emerald-600/20 hover:to-emerald-700/20 border-2 border-emerald-400/50 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <Camera className="w-10 h-10 text-emerald-400" />
            <span className="font-semibold text-lg">Escanear Foto</span>
            <span className="text-xs text-gray-300">Tire uma foto do alimento</span>
          </button>

          <button
            onClick={handleBarcodeScan}
            className="bg-gradient-to-br from-[#2a3150] to-[#1f2640] hover:from-blue-600/20 hover:to-blue-700/20 border-2 border-blue-400/50 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <Barcode className="w-10 h-10 text-blue-400" />
            <span className="font-semibold text-lg">Código de Barras</span>
            <span className="text-xs text-gray-300">Escaneie o produto</span>
          </button>

          <button
            onClick={handleVoiceLog}
            disabled={isListening}
            className={`bg-gradient-to-br from-[#2a3150] to-[#1f2640] hover:from-purple-600/20 hover:to-purple-700/20 border-2 border-purple-400/50 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3 ${
              isListening ? 'animate-pulse' : ''
            }`}
          >
            <Mic className="w-10 h-10 text-purple-400" />
            <span className="font-semibold text-lg">
              {isListening ? 'Ouvindo...' : 'Registro por Voz'}
            </span>
            <span className="text-xs text-gray-300">
              {isListening ? 'Fale o que comeu' : 'Diga o que você comeu'}
            </span>
          </button>
        </section>

        {/* Diário Alimentar */}
        <section className="bg-gradient-to-br from-[#2a3150] to-[#1f2640] rounded-2xl shadow-2xl p-6 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Diário Alimentar</h2>
            </div>
            <span className="text-sm text-gray-300 bg-indigo-600/30 px-3 py-1 rounded-full border border-indigo-400/30">
              {meals.length} refeições hoje
            </span>
          </div>

          {meals.length === 0 ? (
            <div className="text-center py-12">
              <Apple className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">Nenhuma refeição registrada hoje</p>
              <p className="text-gray-400 text-sm">
                Use os botões acima para registrar suas refeições
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-gradient-to-r from-indigo-900/30 to-indigo-800/20 border border-indigo-500/30 rounded-xl p-4 hover:shadow-lg hover:border-indigo-400/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-white">{meal.name}</span>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-400/30">
                          {getMealTypeLabel(meal.type)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div className="bg-blue-600/20 rounded-lg p-2 border border-blue-400/30">
                          <p className="text-xs text-cyan-300 mb-1">Calorias</p>
                          <p className="font-bold text-white">{meal.calories} kcal</p>
                        </div>
                        <div className="bg-emerald-600/20 rounded-lg p-2 border border-emerald-400/30">
                          <p className="text-xs text-emerald-300 mb-1">Proteínas</p>
                          <p className="font-bold text-white">{meal.protein}g</p>
                        </div>
                        <div className="bg-orange-600/20 rounded-lg p-2 border border-orange-400/30">
                          <p className="text-xs text-orange-300 mb-1">Carboidratos</p>
                          <p className="font-bold text-white">{meal.carbs}g</p>
                        </div>
                        <div className="bg-purple-600/20 rounded-lg p-2 border border-purple-400/30">
                          <p className="text-xs text-purple-300 mb-1">Gorduras</p>
                          <p className="font-bold text-white">{meal.fat}g</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(meal.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="ml-4 text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/30"
                      aria-label="Deletar refeição"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Dicas do Dia */}
        <section className="bg-gradient-to-br from-[#2a3150] to-[#1f2640] rounded-2xl shadow-2xl p-6 border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Dicas do Dia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getDailyTips().map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-xl p-5 border-2 border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed flex-1">
                    {tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              💡 As dicas mudam todos os dias! Volte amanhã para ver novas orientações.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>FitAi Pro - Seu aliado na alimentação saudável 🥗</p>
      </footer>
    </div>
  );
}
