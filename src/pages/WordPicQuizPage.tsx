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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initQuiz();
  }, []);

  const handleOptionClick = async (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const currentQ = questions[currentIndex];

    if (option === currentQ.answer) {
      setIsCorrect(true);
      await sleep(1200); // Celebration time
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

  if (loading) return <div className="h-full flex justify-center items-center">Loading...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-green-50 relative">
      {/* Header */}
      <header className="px-4 py-4 pt-12 flex items-center absolute top-0 w-full z-10">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-800 rounded-full hover:bg-black/5">
          <ChevronLeft className="w-8 h-8" />
        </button>
      </header>

      {/* Progress */}
      <div className="absolute top-6 right-6 text-sm font-bold text-green-600 pt-10">
        {currentIndex + 1} / {questions.length}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Image Card */}
        <div className="w-full max-w-[300px] h-[340px] bg-white rounded-[32px] shadow-sm mb-8 flex flex-col overflow-hidden relative border-4 border-green-100">
          <div className="flex-1 bg-gray-100 flex justify-center items-center p-6">
            <img
              src={currentQ.imageUrl}
              alt={currentQ.krWord}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div className="h-[80px] bg-white flex justify-center items-center border-t border-gray-100">
            <span className="text-2xl font-bold text-gray-800">{currentQ.krWord}</span>
          </div>

          {/* Correct Overlay (Celebration) */}
          {isCorrect && (
            <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex justify-center items-center animate-in fade-in zoom-in duration-300">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          )}
        </div>

        {/* Options Chips */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {currentQ.options.map((opt) => {
            let stateClass = "bg-white border-green-100 text-gray-700 hover:border-green-300";

            if (selectedOption === opt) {
              if (isCorrect) {
                // Correct logic handled by overlay, but highlighting the button is good too
                stateClass = "bg-green-500 text-white border-green-500";
              } else if (isCorrect === false) {
                stateClass = "bg-red-500 text-white border-red-500 animate-shake";
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className={cn(
                  "px-6 py-3 rounded-full text-lg font-bold shadow-sm border-2 transition-all active:scale-95",
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
