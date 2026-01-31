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

  // Data State
  const [questions, setQuestions] = useState<QuizData[]>([]);
  const [currentQIndex] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);

  // Quiz State
  const [mode, setMode] = useState<'easy' | 'hard'>('hard');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [hintUsed, setHintUsed] = useState<Record<number, boolean>>({});
  const [bankItems, setBankItems] = useState<string[]>([]);

  // Feedback State
  const [isChecking, setIsChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<{ isPerfect: boolean, correction?: string, desc: string } | null>(null);

  // Refs for focusing inputs
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    // Init Data
    const init = async () => {
      const cat = categoriesData.find(c => c.id === categoryId);
      if (cat) setCategoryInfo(cat as Category);

      if (categoryId) {
        try {
          const data = await api.get<QuizData[]>(`/quiz?categoryId=${categoryId}`);
          setQuestions(data);
        } catch (e) {
          console.error(e);
        }
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

  // --- Handlers ---

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
      if (nextChunkId && inputRefs.current[nextChunkId]) {
        inputRefs.current[nextChunkId]?.focus();
      }
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
        ? "자연스러운 표현이에요! 상대방이 기분 좋게 받아들일 것 같네요."
        : "의미 전달이 조금 어려울 수 있어요. 일본어는 조사를 정확히 쓰는 게 중요해요."
    });

    setIsChecking(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!currentQ) return <div className="p-6">Loading Question...</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <header className="px-4 py-4 pt-12 flex items-center bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-gray-800 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        {categoryInfo && (
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryInfo.icon}</span>
            <span className="font-bold text-gray-800">{categoryInfo.title}</span>
          </div>
        )}
      </header>

      <div className="px-6 py-4">
        <div className="bg-gray-200 rounded-full p-1 flex">
          <button
            onClick={() => handleModeSwitch('easy')}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-all",
              mode === 'easy' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            🐣 퍼즐 (Easy)
          </button>
          <button
            onClick={() => handleModeSwitch('hard')}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-all",
              mode === 'hard' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            🔥 작문 (Hard)
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar pb-32">
        <div className="text-center mt-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 break-keep">{currentQ.krPrompt}</h2>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8 w-full">
          {currentQ.chunks.map((chunk, index) => {
            const val = userAnswers[chunk.id] || "";
            const isFilled = !!val;

            return (
              <div key={chunk.id} className="flex flex-col items-center gap-1">
                {mode === 'hard' && (
                  <button
                    onClick={() => handleHint(chunk.id, chunk.text)}
                    className="text-gray-400 hover:text-yellow-500 mb-1 transition-colors"
                    title="힌트 보기"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                )}

                {mode === 'hard' ? (
                  <input
                    ref={(el) => { if (inputRefs.current) inputRefs.current[chunk.id] = el; }}
                    value={val}
                    onChange={(e) => handleInputChange(chunk.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={chunk.meaning}
                    className={cn(
                      "border-b-2 border-gray-300 bg-transparent text-center text-lg py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-300",
                      hintUsed[chunk.id] && "text-blue-500 font-bold border-blue-200"
                    )}
                    style={{ width: chunk.width }}
                  />
                ) : (
                  <div
                    onClick={() => handleSlotClick(chunk.id)}
                    className={cn(
                      "h-10 border-b-2 flex items-center justify-center text-lg cursor-pointer transition-all min-w-[60px] px-2",
                      isFilled ? "border-gray-800 text-gray-900" : "border-gray-200 text-gray-300"
                    )}
                  >
                    {val || chunk.meaning}
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
                    "px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-lg font-medium active:scale-95 transition-all mb-2",
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

      <div className="p-6 bg-white border-t border-gray-100 absolute bottom-0 w-full">
        <button
          onClick={startCheck}
          className="w-full py-4 bg-blue-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          검사 받기
        </button>
      </div>

      <div className={cn(
        "fixed inset-0 z-50 flex items-end justify-center pointer-events-none transition-opacity duration-300",
        showModal ? "opacity-100 pointer-events-auto" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={closeModal} />

        <div className={cn(
          "bg-white w-full max-w-[375px] rounded-t-[32px] p-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform duration-500 ease-out z-10",
          showModal ? "translate-y-0" : "translate-y-full"
        )}>
          {isChecking ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mb-4" />
              <div className="text-gray-500 font-bold">AI 선생님이 채점 중...</div>
            </div>
          ) : feedback && (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-5xl mb-4 block">
                {feedback.isPerfect ? "🎉" : "👨‍🏫"}
              </span>

              <h3 className={cn(
                "text-2xl font-bold mb-2",
                feedback.isPerfect ? "text-gray-800" : "text-blue-500"
              )}>
                {feedback.isPerfect ? "완벽해요! (Perfect)" : "조금만 더 다듬어 볼까요?"}
              </h3>

              {!feedback.isPerfect && (
                <div className="w-full bg-gray-100 p-4 rounded-xl mb-6 text-left">
                  <span className="text-xs text-gray-400 font-bold block mb-1">정답 교정</span>
                  <div className="text-lg font-bold text-blue-600">
                    {feedback.correction}
                  </div>
                </div>
              )}

              <p className="text-gray-600 leading-relaxed mb-8 text-sm">
                {feedback.desc}
              </p>

              <button
                onClick={closeModal}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg active:scale-95 transition-transform"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
