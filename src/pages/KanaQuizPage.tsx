import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../lib/apiClient';
import type { KanaData } from '../types';
import { cn, shuffleArray, sleep } from '../lib/utils';

export default function KanaQuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<KanaData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Quiz State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // 1. Fetch & Shuffle
    const initQuiz = async () => {
      try {
        const data = await api.get<KanaData[]>('/kana');
        // Shuffle questions
        setQuestions(shuffleArray(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initQuiz();
  }, []);

  const handleOptionClick = async (option: string) => {
    if (selectedOption) return; // Block multiple clicks

    setSelectedOption(option);
    const currentQ = questions[currentIndex];

    if (option === currentQ.correctChar) {
      // Correct
      setIsCorrect(true);
      await sleep(1000); // Wait 1s
      nextQuestion();
    } else {
      // Wrong
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake
      await sleep(1000); // Show red for 1s
      // Reset state for retry or next? Usually retry until correct in strict mode, 
      // but for this simple app, let's just reset selection to allow retry.
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // End of Quiz
      alert("모든 문제를 풀었습니다!"); // Replace with proper result modal later preferably
      navigate('/');
    }
  };

  if (loading) return <div className="h-full flex justify-center items-center">Loading...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-yellow-50 relative overflow-hidden">
      {/* Header */}
      <header className="px-4 py-4 pt-12 flex items-center absolute top-0 w-full z-10">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-800 rounded-full hover:bg-black/5">
          <ChevronLeft className="w-8 h-8" />
        </button>
      </header>

      {/* Progress */}
      <div className="absolute top-6 right-6 text-sm font-bold text-yellow-600 pt-10">
        {currentIndex + 1} / {questions.length}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Question Card */}
        <div className="w-full max-w-[280px] aspect-square bg-white rounded-[40px] shadow-lg flex flex-col justify-center items-center mb-12 border-4 border-yellow-200">
          <span className="text-gray-400 text-sm font-bold mb-2">이 발음은?</span>
          <h1 className="text-[80px] font-black text-gray-800 leading-none">{currentQ.sound}</h1>
        </div>

        {/* Options Grid */}
        <div className={cn(
          "grid grid-cols-2 gap-4 w-full px-4",
          shake && "animate-shake" // Need custom shake animation in tailwind config or global css
        )}>
          {currentQ.options.map((opt) => {
            let stateClass = "bg-white border-white text-gray-700 hover:border-yellow-200";

            if (selectedOption === opt) {
              if (isCorrect) {
                stateClass = "bg-green-100 border-green-400 text-green-600";
              } else if (isCorrect === false) {
                stateClass = "bg-red-100 border-red-400 text-red-600";
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className={cn(
                  "h-20 rounded-2xl text-4xl font-bold shadow-sm border-2 transition-all active:scale-95",
                  stateClass
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </main>
    </div>
  );
}
