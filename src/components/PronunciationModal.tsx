import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Volume2, 
  Activity, 
  Award, 
  Lightbulb, 
  Repeat, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PronunciationAnalysis {
  score: number;
  level: string;
  phoneticGuide: string;
  tips: string[];
  practicePhrase: string;
  feedback: string;
}

interface PronunciationModalProps {
  isOpen: boolean;
  onClose: () => void;
  textToAnalyze: string;
  targetLang: 'pt' | 'en';
  originalText?: string;
  onPlayAudio: (text: string, lang: 'pt' | 'en') => void;
}

export const PronunciationModal: React.FC<PronunciationModalProps> = ({
  isOpen,
  onClose,
  textToAnalyze,
  targetLang,
  originalText,
  onPlayAudio
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PronunciationAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && textToAnalyze && textToAnalyze !== '...') {
      analyzePronunciation();
    }
  }, [isOpen, textToAnalyze, targetLang]);

  const analyzePronunciation = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/pronunciation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          lang: targetLang,
          originalText
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao analisar fonética.');
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar análise.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#120404] border-2 border-cyan-400/40 p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-zinc-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              Análise de Pronúncia IA
            </h2>
            <p className="text-xs text-zinc-400">
              Diagnóstico Fonético · {targetLang === 'en' ? '🇺🇸 Inglês' : '🇧🇷 Português'}
            </p>
          </div>
        </div>

        {/* Target Phrase Box */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 mb-4">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
            <span>Frase Avaliada:</span>
            <button
              onClick={() => onPlayAudio(textToAnalyze, targetLang)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Modelo</span>
            </button>
          </div>
          <p className="text-sm font-semibold text-white break-words">
            "{textToAnalyze}"
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-widest text-cyan-300 font-bold animate-pulse">
              Jarvis analisando espectro de fonemas...
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && !isLoading && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-semibold mb-4">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Analysis Results View */}
        {analysis && !isLoading && (
          <div className="space-y-4">
            {/* Score & Level Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-black to-blue-950/40 border border-cyan-400/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                  Precisão Fonética
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-cyan-400">{analysis.score}</span>
                  <span className="text-xs font-bold text-zinc-400">/ 100 pts</span>
                </div>
                <span className="text-xs font-bold text-amber-300">{analysis.level}</span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Phonetic Breakdown */}
            {analysis.phoneticGuide && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Guia Fonético</span>
                </div>
                <p className="text-xs text-zinc-300 font-mono tracking-wide leading-relaxed">
                  {analysis.phoneticGuide}
                </p>
              </div>
            )}

            {/* Practical Tips */}
            {analysis.tips && analysis.tips.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Dicas Cirúrgicas da IA para Melhorar</span>
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-200">
                  {analysis.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-black">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Phrase / Trava-línguas */}
            {analysis.practicePhrase && (
              <div className="p-3.5 rounded-2xl bg-[#1c0808]/70 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Desafio de Treino Fonético</span>
                  </div>
                  <button
                    onClick={() => onPlayAudio(analysis.practicePhrase, targetLang)}
                    className="flex items-center gap-1 text-[10px] text-amber-300 hover:text-white font-semibold cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Ouvir Desafio</span>
                  </button>
                </div>
                <p className="text-xs font-semibold text-white italic">
                  "{analysis.practicePhrase}"
                </p>
              </div>
            )}

            {/* Motivation Quote */}
            {analysis.feedback && (
              <p className="text-center text-[11px] text-amber-200/80 italic pt-1">
                ⚡ "{analysis.feedback}"
              </p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={analyzePronunciation}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Reavaliar</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
              >
                Praticar e Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
