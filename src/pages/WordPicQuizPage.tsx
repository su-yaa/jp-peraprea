import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../lib/apiClient';
import type { WordPicData } from '../types';
import { cn, shuffleArray, sleep } from '../lib/utils';

export default function WordPicQuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<WordPicData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const initQuiz = async () => {
      try {
        const data = await api.get<WordPicData[]>('/word-pic');
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

    if (option === currentQ.answer) {
      setIsCorrect(true);
      await sleep(1200);
      nextQuestion();
    } else {
      setIsCorrect(false);
      await sleep(1000);
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
      alert("단어 퀴즈 완료! 잘하셨어요 🎉");
      navigate('/');
    }
  };

  if (loading) return <div className="h-full flex justify-center items-center text-cocoa font-bold">로딩중...</div>;
  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-mint-light/50 relative">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-soft text-cocoa">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="px-4 py-2 bg-white rounded-full font-bold text-mint-dark shadow-sm text-sm">
          {currentIndex + 1} / {questions.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        {/* Image Card */}
        <div className="w-full max-w-[300px] bg-white rounded-[40px] shadow-soft mb-8 overflow-hidden border-[6px] border-white ring-4 ring-mint-light">
          <div className="aspect-[4/3] bg-gray-50 flex justify-center items-center p-6">
            <img
              src={currentQ.imageUrl}
              alt={currentQ.krWord}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div className="py-6 bg-white flex justify-center items-center border-t border-gray-100">
            <span className="text-2xl font-extrabold text-cocoa">{currentQ.krWord}</span>
          </div>

          {/* Overlay */}
          {isCorrect && (
            <div className="absolute inset-0 bg-mint-dark/80 backdrop-blur-[2px] flex justify-center items-center animate-in fade-in">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {currentQ.options.map((opt) => {
            let stateClass = "bg-white border-2 border-transparent text-cocoa";
            if (selectedOption === opt) {
              if (isCorrect) stateClass = "bg-mint border-mint-dark text-white";
              else if (isCorrect === false) stateClass = "bg-pink-dark border-pink-dark text-white animate-shake";
            }

            return (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className={cn(
                  "px-6 py-4 rounded-3xl text-lg font-bold shadow-soft transition-all active:scale-95 active:shadow-none active:translate-y-[4px] hover:brightness-105",
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
