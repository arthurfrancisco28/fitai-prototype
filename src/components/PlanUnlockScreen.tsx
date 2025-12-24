'use client';

import { Sparkles, CheckCircle2, Heart, Target, Zap, Lock } from 'lucide-react';

interface PlanUnlockScreenProps {
  userName: string;
  onUnlock: () => void;
}

export default function PlanUnlockScreen({ userName, onUnlock }: PlanUnlockScreenProps) {
  const handleCheckout = () => {
    // Redirecionar para o checkout
    window.location.href = 'https://invoice.infinitepay.io/plans/leticia-tabata-551/ShOB6TIKx';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-8 animate-fade-in">
          {/* Ícone e Título Principal */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              {userName}, seu resultado está pronto
            </h1>
            <p className="text-xl text-purple-600 font-semibold">
              Agora é hora de liberar seu plano personalizado
            </p>
          </div>

          {/* Texto Emocional */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <p className="text-gray-700 leading-relaxed text-center">
              Você já deu o <strong>primeiro passo</strong>. Com base nas suas respostas, criamos um plano 
              <strong> feito exatamente para você</strong>, para o seu momento, para o seu objetivo.
            </p>
            <p className="text-gray-700 leading-relaxed text-center mt-4">
              Continuar agora é uma <strong>decisão de autocuidado</strong>, de responsabilidade e 
              compromisso <strong>consigo mesma</strong>. Adiar é continuar no mesmo lugar.
            </p>
            <p className="text-purple-700 font-semibold text-center mt-4 text-lg">
              Você já chegou até aqui. O próximo passo é seu.
            </p>
          </div>

          {/* Benefícios */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
              O que você vai ter acesso:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-4 bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200 hover:shadow-md transition-all">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Acesso imediato ao plano correto</p>
                  <p className="text-sm text-gray-600">Personalizado para o seu momento e objetivo</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border-2 border-blue-200 hover:shadow-md transition-all">
                <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Conteúdo organizado e aplicável</p>
                  <p className="text-sm text-gray-600">Simples de seguir, sem complicação</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-4 border-2 border-purple-200 hover:shadow-md transition-all">
                <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Direcionamento claro do que fazer</p>
                  <p className="text-sm text-gray-600">Sem confusão, sem perder tempo</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-pink-50 rounded-xl p-4 border-2 border-pink-200 hover:shadow-md transition-all">
                <Heart className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Apoio para sair da estagnação</p>
                  <p className="text-sm text-gray-600">Economia de tempo, energia e decisões</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="space-y-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-8 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 animate-pulse"
            >
              <Lock className="w-6 h-6" />
              Liberar meu plano personalizado agora
            </button>
            
            <p className="text-center text-sm text-gray-500">
              Acesso imediato após a confirmação do pagamento
            </p>
          </div>

          {/* Mensagem Final */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
            <p className="text-center text-gray-700 leading-relaxed">
              <strong className="text-amber-700">Lembre-se:</strong> Você merece investir em si mesma. 
              Cada dia que passa sem agir é um dia a mais no mesmo lugar. 
              <strong> A transformação começa com uma decisão consciente.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
