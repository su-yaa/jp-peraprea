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
    const initQuiz = async () => {
      try {
        const data = await api.get<KanaData[]>('/kana');
        setQuestions(shuffleArray(data));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    initQuiz();
  }, []);

  const handleOptionClick = async (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const currentQ = questions[currentIndex];

    if (option === currentQ.correctChar) {
      setIsCorrect(true);
      await sleep(800);
      nextQuestion();
    } else {
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      await sleep(800);
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
      alert("학습 완료! 참 잘했어요 👏");
      navigate('/');
    }
  };

  if (loading) return <div className="h-full flex justify-center items-center text-cocoa font-bold">로딩중...</div>;
  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-pink-light/50 relative">
      {/* Header */}
      <header className="px-6 pt-10 pb-2 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-soft text-cocoa">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="px-4 py-2 bg-white rounded-full font-bold text-pink-dark shadow-sm text-sm">
          {currentIndex + 1} / {questions.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        {/* Question Card */}
        <div className="w-[200px] h-[200px] bg-white rounded-[48px] shadow-soft mb-12 flex flex-col justify-center items-center border-[6px] border-white ring-4 ring-pink-200">
          <span className="text-pink-400 text-xs font-bold mb-2 uppercase tracking-widest">Sound</span>
          <h1 className="text-[90px] font-black text-cocoa leading-none mt-[-10px]">{currentQ.sound}</h1>
        </div>

        {/* Options */}
        <div className={cn(
          "grid grid-cols-2 gap-4 w-full px-2",
          shake && "animate-shake"
        )}>
          {currentQ.options.map((opt) => {
            let stateClass = "bg-white border-2 border-transparent text-cocoa";
            if (selectedOption === opt) {
              if (isCorrect) stateClass = "bg-mint border-mint-dark text-white shadow-none translate-y-[4px]";
              else if (isCorrect === false) stateClass = "bg-pink-dark border-pink-dark text-white shadow-none translate-y-[4px]";
            }

            return (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className={cn(
                  "h-20 rounded-3xl text-3xl font-bold shadow-soft transition-all active:scale-95 active:shadow-none active:translate-y-[4px] hover:brightness-105",
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
