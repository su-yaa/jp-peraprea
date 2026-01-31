import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Lightbulb } from 'lucide-react';
import api from '../lib/apiClient';
import type { QuizData, Category } from '../types';
import { cn, sleep } from '../lib/utils';
import categoriesData from '../data/categories.json';

export default function SentenceQuizPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizData[]>([]);
  const [currentQIndex] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);

  const [mode, setMode] = useState<'easy' | 'hard'>('hard');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [hintUsed, setHintUsed] = useState<Record<number, boolean>>({});
  const [bankItems, setBankItems] = useState<string[]>([]);

  const [isChecking, setIsChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<{ isPerfect: boolean, correction?: string, desc: string } | null>(null);

  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    const init = async () => {
      const cat = categoriesData.find(c => c.id === categoryId);
      if (cat) setCategoryInfo(cat as Category);
      if (categoryId) {
        try {
          const data = await api.get<QuizData[]>(`/quiz?categoryId=${categoryId}`);
          setQuestions(data);
        } catch (e) { console.error(e); }
      }
    };
    init();
  }, [categoryId]);

  useEffect(() => {
    if (!questions[currentQIndex]) return;
    setUserAnswers({});
    setHintUsed({});
    if (mode === 'easy') {
      const chunks = questions[currentQIndex].chunks.map(c => c.text);
      setBankItems([...chunks].sort(() => Math.random() - 0.5));
    }
  }, [currentQIndex, mode, questions]);

  const currentQ = questions[currentQIndex];

  const handleModeSwitch = (newMode: 'easy' | 'hard') => {
    setMode(newMode);
    setUserAnswers({});
    setHintUsed({});
    setFeedback(null);
    setShowModal(false);
  };

  const handleInputChange = (chunkId: number, val: string) => {
    setUserAnswers(prev => ({ ...prev, [chunkId]: val }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextChunkId = currentQ.chunks[index + 1]?.id;
      if (nextChunkId && inputRefs.current[nextChunkId]) inputRefs.current[nextChunkId]?.focus();
    }
  };

  const handleHint = (chunkId: number, correctText: string) => {
    setUserAnswers(prev => ({ ...prev, [chunkId]: correctText }));
    setHintUsed(prev => ({ ...prev, [chunkId]: true }));
    inputRefs.current[chunkId]?.focus();
  };

  const handleBankClick = (text: string) => {
    const firstEmptyIndex = currentQ.chunks.findIndex(c => !userAnswers[c.id]);
    if (firstEmptyIndex !== -1) {
      const chunkId = currentQ.chunks[firstEmptyIndex].id;
      setUserAnswers(prev => ({ ...prev, [chunkId]: text }));
    }
  };

  const handleSlotClick = (chunkId: number) => {
    if (!userAnswers[chunkId]) return;
    const newAns = { ...userAnswers };
    delete newAns[chunkId];
    setUserAnswers(newAns);
  };

  const startCheck = async () => {
    setShowModal(true);
    setIsChecking(true);
    await sleep(1500);
    const isPerfect = currentQ.chunks.every(c => (userAnswers[c.id] || "").trim() === c.text);
    setFeedback({
      isPerfect,
      correction: isPerfect ? undefined : currentQ.correctAnswer,
      desc: isPerfect
        ? "완벽해요! 원어민처럼 자연스러워요."
        : "조금 아쉬워요! 조사를 정확히 써볼까요?"
    });
    setIsChecking(false);
  };

  if (!currentQ) return <div className="p-6 text-cocoa font-bold">로딩중...</div>;

  return (
    <div className="flex flex-col h-full bg-sky-light/30 relative">
      {/* Header */}
      <header className="px-4 pt-10 pb-4 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 bg-white rounded-full shadow-sm text-cocoa">
          <ChevronLeft className="w-6 h-6" />
        </button>
        {categoryInfo && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <span className="font-extrabold text-cocoa text-lg">{categoryInfo.title}</span>
          </div>
        )}
      </header>

      {/* Mode Switcher */}
      <div className="px-6 py-4">
        <div className="bg-white p-1.5 flex rounded-full shadow-sm border border-gray-100">
          <button
            onClick={() => handleModeSwitch('easy')}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-all",
              mode === 'easy' ? "bg-sky-light text-sky-dark shadow-sm" : "text-gray-400 hover:text-gray-500"
            )}
          >
            🐣 퍼즐 (Easy)
          </button>
          <button
            onClick={() => handleModeSwitch('hard')}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-all",
              mode === 'hard' ? "bg-pink-light text-pink-dark shadow-sm" : "text-gray-400 hover:text-gray-500"
            )}
          >
            🔥 작문 (Hard)
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar pb-32">
        <div className="text-center mt-4 mb-10 bg-white p-6 rounded-3xl shadow-soft border-2 border-sky-100">
          <h2 className="text-xl font-bold text-cocoa break-keep leading-relaxed">{currentQ.krPrompt}</h2>
        </div>

        {/* Input Area */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 w-full">
          {currentQ.chunks.map((chunk, index) => {
            const val = userAnswers[chunk.id] || "";
            const isFilled = !!val;

            return (
              <div key={chunk.id} className="flex flex-col items-center gap-2">
                {mode === 'hard' ? (
                  <div className="relative">
                    <input
                      ref={(el) => { if (inputRefs.current) inputRefs.current[chunk.id] = el; }}
                      value={val}
                      onChange={(e) => handleInputChange(chunk.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder={chunk.meaning}
                      className={cn(
                        "bg-white border-2 border-gray-200 text-center text-lg py-3 rounded-2xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-gray-300 font-bold text-cocoa shadow-sm",
                        hintUsed[chunk.id] && "text-sky-500 border-sky-300"
                      )}
                      style={{ width: Math.max(80, parseInt(chunk.width)) }}
                    />
                    <button
                      onClick={() => handleHint(chunk.id, chunk.text)}
                      className="absolute -top-3 -right-2 bg-yellow-100 p-1 rounded-full text-yellow-500 hover:scale-110 transition-transform shadow-sm"
                      title="힌트"
                    >
                      <Lightbulb className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => handleSlotClick(chunk.id)}
                    className={cn(
                      "h-12 border-2 flex items-center justify-center text-lg cursor-pointer transition-all min-w-[70px] px-3 rounded-2xl font-bold shadow-sm",
                      isFilled
                        ? "bg-white border-sky-200 text-cocoa"
                        : "bg-gray-100 border-dashed border-gray-300 text-gray-400"
                    )}
                  >
                    {val || chunk.meaning}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Word Bank for Easy Mode */}
        {mode === 'easy' && (
          <div className="flex flex-wrap gap-3 justify-center mt-auto">
            {bankItems.map((text, i) => {
              const totalInAnswer = Object.values(userAnswers).filter(v => v === text).length;
              const thisWordIndex = bankItems.slice(0, i).filter(v => v === text).length;
              const isVisible = thisWordIndex >= totalInAnswer;

              return (
                <button
                  key={i}
                  onClick={() => isVisible && handleBankClick(text)}
                  className={cn(
                    "px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl shadow-soft text-lg font-bold text-cocoa active:scale-95 active:shadow-none active:translate-y-[4px] transition-all mb-2 hover:border-sky-200",
                    !isVisible && "opacity-0 pointer-events-none"
                  )}
                >
                  {text}
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer Button */}
      <div className="p-6 bg-white/90 backdrop-blur border-t border-gray-100 absolute bottom-0 w-full z-10">
        <button
          onClick={startCheck}
          className="w-full py-4 bg-cocoa text-white rounded-3xl text-lg font-extrabold shadow-soft active:shadow-none active:translate-y-[4px] transition-all hover:brightness-110"
        >
          검사 받기
        </button>
      </div>

      {/* Check Modal */}
      <div className={cn(
        "fixed inset-0 z-50 flex items-end justify-center pointer-events-none transition-opacity duration-300",
        showModal ? "opacity-100 pointer-events-auto" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowModal(false)} />

        <div className={cn(
          "bg-white w-full max-w-[375px] rounded-t-[40px] p-8 pb-10 shadow-[0_-10px_60px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-out z-10",
          showModal ? "translate-y-0" : "translate-y-full"
        )}>
          {isChecking ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-pink-400 rounded-full animate-spin mb-4" />
              <div className="text-cocoa font-bold text-lg animate-pulse">채점 중이에요...</div>
            </div>
          ) : feedback && (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-6xl mb-4 animate-bounce">
                {feedback.isPerfect ? "🎉" : "�"}
              </div>

              <h3 className={cn(
                "text-2xl font-extrabold mb-2",
                feedback.isPerfect ? "text-cocoa" : "text-pink-500"
              )}>
                {feedback.isPerfect ? "완벽해요!" : "조금 더 힘내볼까요?"}
              </h3>

              {!feedback.isPerfect && (
                <div className="w-full bg-pink-50 border border-pink-100 p-5 rounded-3xl mb-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-pink-200" />
                  <span className="text-xs text-pink-400 font-bold block mb-1 uppercase tracking-wider">Correct Answer</span>
                  <div className="text-lg font-bold text-pink-600 break-keep">
                    {feedback.correction}
                  </div>
                </div>
              )}

              <p className="text-gray-500 leading-relaxed mb-8 text-sm font-medium bg-gray-50 p-4 rounded-2xl w-full">
                {feedback.desc}
              </p>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-cocoa text-white rounded-3xl font-bold text-lg shadow-soft active:shadow-none active:translate-y-[4px] transition-all"
              >
                계속하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
