'use client';

import { useState } from 'react';
import { ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { QuizAnswers, UserProfile } from '@/lib/types';
import { calculateDailyCalories, determineGoalType, calculateIntensity } from '@/lib/quiz-calculator';
import { storage } from '@/lib/storage';
import PlanUnlockScreen from './PlanUnlockScreen';

interface QuizFunnelProps {
  onComplete: () => void;
}

type QuizStep = 
  | 'welcome'
  | 'name'
  | 'age'
  | 'gender'
  | 'weight'
  | 'targetWeight'
  | 'height'
  | 'dietRoutine'
  | 'mealsPerDay'
  | 'mainDifficulty'
  | 'mainGoal'
  | 'aiInterest'
  | 'loading'
  | 'result'
  | 'unlock';

export default function QuizFunnel({ onComplete }: QuizFunnelProps) {
  const [step, setStep] = useState<QuizStep>('welcome');
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [estimatedCalories, setEstimatedCalories] = useState<number>(0);

  const updateAnswer = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    const steps: QuizStep[] = [
      'welcome',
      'name',
      'age',
      'gender',
      'weight',
      'targetWeight',
      'height',
      'dietRoutine',
      'mealsPerDay',
      'mainDifficulty',
      'mainGoal',
      'aiInterest',
      'loading',
      'result',
      'unlock',
    ];
    
    const currentIndex = steps.indexOf(step);
    const nextStepValue = steps[currentIndex + 1];
    
    if (nextStepValue === 'loading') {
      setStep('loading');
      // Simular processamento
      setTimeout(() => {
        const calories = calculateDailyCalories(answers as QuizAnswers);
        setEstimatedCalories(calories);
        
        // Calcular diferença de peso e tipo de objetivo
        const weightDifference = (answers.weight || 0) - (answers.targetWeight || 0);
        const goalType = determineGoalType(answers.weight || 0, answers.targetWeight || 0);
        
        // Salvar perfil completo
        const profile: UserProfile = {
          ...(answers as QuizAnswers),
          estimatedCalories: calories,
          completedQuiz: true,
          quizCompletedAt: Date.now(),
          weightDifference,
          goalType,
        };
        storage.saveUserProfile(profile);
        
        setStep('result');
      }, 2500);
    } else {
      setStep(nextStepValue);
    }
  };

  const handleGoToUnlock = () => {
    setStep('unlock');
  };

  const handleFinish = () => {
    onComplete();
  };

  // Mostrar tela de unlock se estiver nesse step
  if (step === 'unlock') {
    return <PlanUnlockScreen userName={answers.name || 'Usuário'} onUnlock={handleFinish} />;
  }

  // Renderização condicional por step
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome */}
        {step === 'welcome' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Bem-vindo ao FitAi Pro
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Descubra quantas calorias você precisa por dia e como melhorar sua alimentação
            </p>
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Começar agora
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Nome */}
        {step === 'name' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é o seu nome?</h2>
              <p className="text-gray-600">Vamos personalizar sua experiência</p>
            </div>
            <input
              type="text"
              value={answers.name || ''}
              onChange={(e) => updateAnswer('name', e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
            />
            <button
              onClick={nextStep}
              disabled={!answers.name}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Idade */}
        {step === 'age' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é a sua idade?</h2>
              <p className="text-gray-600">Isso nos ajuda a calcular suas necessidades</p>
            </div>
            <input
              type="number"
              value={answers.age || ''}
              onChange={(e) => updateAnswer('age', parseInt(e.target.value))}
              placeholder="Ex: 25"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
              min="10"
              max="120"
            />
            <button
              onClick={nextStep}
              disabled={!answers.age || answers.age < 10}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Sexo */}
        {step === 'gender' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é o seu sexo?</h2>
              <p className="text-gray-600">Importante para cálculos precisos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  updateAnswer('gender', 'male');
                  setTimeout(nextStep, 300);
                }}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-500 text-blue-700 px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Masculino
              </button>
              <button
                onClick={() => {
                  updateAnswer('gender', 'female');
                  setTimeout(nextStep, 300);
                }}
                className="bg-pink-50 hover:bg-pink-100 border-2 border-pink-500 text-pink-700 px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Feminino
              </button>
            </div>
          </div>
        )}

        {/* Peso Atual */}
        {step === 'weight' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é o seu peso atual?</h2>
              <p className="text-gray-600">Em quilogramas (kg)</p>
            </div>
            <input
              type="number"
              value={answers.weight || ''}
              onChange={(e) => updateAnswer('weight', parseFloat(e.target.value))}
              placeholder="Ex: 70"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
              min="30"
              max="300"
              step="0.1"
            />
            <button
              onClick={nextStep}
              disabled={!answers.weight || answers.weight < 30}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Peso Desejado - NOVA PERGUNTA */}
        {step === 'targetWeight' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é o peso que você deseja atingir?</h2>
              <p className="text-gray-600">Sua meta de peso em quilogramas (kg)</p>
              {answers.weight && (
                <p className="text-sm text-emerald-600 mt-2">
                  Peso atual: {answers.weight} kg
                </p>
              )}
            </div>
            <input
              type="number"
              value={answers.targetWeight || ''}
              onChange={(e) => updateAnswer('targetWeight', parseFloat(e.target.value))}
              placeholder="Ex: 65"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
              min="30"
              max="300"
              step="0.1"
            />
            {answers.targetWeight && answers.weight && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-700 font-medium">
                  {answers.weight > answers.targetWeight ? (
                    <>Meta: perder {(answers.weight - answers.targetWeight).toFixed(1)} kg</>
                  ) : answers.weight < answers.targetWeight ? (
                    <>Meta: ganhar {(answers.targetWeight - answers.weight).toFixed(1)} kg</>
                  ) : (
                    <>Meta: manter o peso atual</>
                  )}
                </p>
              </div>
            )}
            <button
              onClick={nextStep}
              disabled={!answers.targetWeight || answers.targetWeight < 30}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Altura */}
        {step === 'height' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é a sua altura?</h2>
              <p className="text-gray-600">Em centímetros (cm)</p>
            </div>
            <input
              type="number"
              value={answers.height || ''}
              onChange={(e) => updateAnswer('height', parseFloat(e.target.value))}
              placeholder="Ex: 170"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
              min="100"
              max="250"
            />
            <button
              onClick={nextStep}
              disabled={!answers.height || answers.height < 100}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Rotina Alimentar */}
        {step === 'dietRoutine' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Como está sua rotina alimentar?</h2>
              <p className="text-gray-600">Seja honesto, isso nos ajuda a te ajudar melhor</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'very_irregular', label: 'Muito desregulada' },
                { value: 'somewhat', label: 'Mais ou menos' },
                { value: 'relatively_healthy', label: 'Relativamente saudável' },
                { value: 'very_healthy', label: 'Muito saudável' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateAnswer('dietRoutine', option.value as QuizAnswers['dietRoutine']);
                    setTimeout(nextStep, 300);
                  }}
                  className="w-full bg-gray-50 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 px-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Refeições por dia */}
        {step === 'mealsPerDay' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quantas refeições você faz por dia?</h2>
              <p className="text-gray-600">Incluindo lanches e pequenas refeições</p>
            </div>
            <div className="space-y-3">
              {[
                { value: '1-2', label: '1 a 2 refeições' },
                { value: '3', label: '3 refeições' },
                { value: '4-5', label: '4 a 5 refeições' },
                { value: '5+', label: 'Mais de 5 refeições' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateAnswer('mealsPerDay', option.value as QuizAnswers['mealsPerDay']);
                    setTimeout(nextStep, 300);
                  }}
                  className="w-full bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-700 px-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Maior dificuldade */}
        {step === 'mainDifficulty' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual sua maior dificuldade?</h2>
              <p className="text-gray-600">Com relação à alimentação</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'dont_know', label: 'Não sei o que comer' },
                { value: 'no_time', label: 'Falta de tempo' },
                { value: 'compulsion', label: 'Compulsão / exageros' },
                { value: 'no_results', label: 'Não vejo resultados' },
                { value: 'inconsistency', label: 'Falta de constância' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateAnswer('mainDifficulty', option.value as QuizAnswers['mainDifficulty']);
                    setTimeout(nextStep, 300);
                  }}
                  className="w-full bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 text-gray-700 hover:text-purple-700 px-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Objetivo principal */}
        {step === 'mainGoal' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual é o seu objetivo principal?</h2>
              <p className="text-gray-600">Vamos personalizar tudo para você</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'lose_weight', label: 'Emagrecer' },
                { value: 'gain_muscle', label: 'Ganhar massa muscular' },
                { value: 'maintain', label: 'Manter o peso e ser mais saudável' },
                { value: 'improve_diet', label: 'Melhorar a alimentação' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateAnswer('mainGoal', option.value as QuizAnswers['mainGoal']);
                    setTimeout(nextStep, 300);
                  }}
                  className="w-full bg-gray-50 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 px-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interesse em IA */}
        {step === 'aiInterest' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Gostaria de ajuda inteligente?</h2>
              <p className="text-gray-600">Nossa IA pode te guiar no dia a dia</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'yes', label: 'Sim, com certeza' },
                { value: 'maybe', label: 'Talvez' },
                { value: 'not_much', label: 'Não muito' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateAnswer('aiInterest', option.value as QuizAnswers['aiInterest']);
                    setTimeout(nextStep, 300);
                  }}
                  className="w-full bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-700 px-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {step === 'loading' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center space-y-6 animate-fade-in">
            <Loader2 className="w-16 h-16 text-emerald-500 mx-auto animate-spin" />
            <h2 className="text-3xl font-bold text-gray-800">Analisando suas respostas...</h2>
            <p className="text-gray-600">Estamos calculando suas necessidades personalizadas</p>
          </div>
        )}

        {/* Resultado */}
        {step === 'result' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Parabéns, {answers.name}!
              </h2>
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white">
                <p className="text-lg mb-4">Sua estimativa diária é de aproximadamente</p>
                <p className="text-6xl font-bold mb-4">{estimatedCalories}</p>
                <p className="text-lg">calorias por dia para atingir seu objetivo</p>
              </div>
              
              {/* Informações sobre a meta de peso */}
              {answers.weight && answers.targetWeight && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-left">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Sua Meta de Peso</h3>
                  <div className="space-y-2 text-blue-700">
                    <p><strong>Peso atual:</strong> {answers.weight} kg</p>
                    <p><strong>Peso desejado:</strong> {answers.targetWeight} kg</p>
                    <p><strong>Diferença:</strong> {Math.abs(answers.weight - answers.targetWeight).toFixed(1)} kg</p>
                    <p className="text-sm mt-3 text-blue-600">
                      {answers.weight > answers.targetWeight ? (
                        <>🎯 Seu plano está focado em <strong>emagrecimento saudável</strong></>
                      ) : answers.weight < answers.targetWeight ? (
                        <>🎯 Seu plano está focado em <strong>ganho de massa</strong></>
                      ) : (
                        <>🎯 Seu plano está focado em <strong>manutenção e saúde</strong></>
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 leading-relaxed">
                Com base nas suas informações, personalizamos tudo para você alcançar seus objetivos de forma saudável e sustentável.
              </p>
              <button
                onClick={handleGoToUnlock}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Ver meu plano personalizado
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
