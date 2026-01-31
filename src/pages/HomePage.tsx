import { useNavigate } from 'react-router-dom';
import { Settings, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Decor Circles */}
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-pink-light rounded-full opacity-50 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-sky-light rounded-full opacity-50 blur-2xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 p-2 rounded-2xl rotate-[-10deg]">
            <span className="text-2xl">🐤</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-cocoa leading-none">Daily Talk</h1>
            <span className="text-xs text-gray-400 font-bold">오하요! 오늘도 힘내자!</span>
          </div>
        </div>
        <button
          className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-cocoa"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6 overflow-y-auto no-scrollbar flex flex-col">

        {/* Mascot Greeting Area */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => navigate('/kana')}>
            <div className="text-[80px] drop-shadow-lg transition-transform hover:scale-110 active:scale-95 duration-300">
              🐻
            </div>
            <div className="absolute -right-4 top-0 bg-white px-3 py-1.5 rounded-xl rounded-bl-sm shadow-soft text-xs font-bold text-cocoa animate-bounce">
              공부할 시간이야!
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-4">
          <div className="text-lg font-extrabold text-cocoa mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            오늘의 학습
          </div>

          {/* Kana Card */}
          <MenuCard
            icon="🐣"
            title="기초 다지기"
            subtitle="히라가나/가타카나"
            theme="pink"
            onClick={() => navigate('/kana')}
          />

          {/* Word Card */}
          <MenuCard
            icon="🖼️"
            title="그림 단어장"
            subtitle="이미지로 외우는 단어"
            theme="mint"
            onClick={() => navigate('/word-pic')}
          />

          {/* Category Card (Full Width) */}
          <div
            onClick={() => navigate('/categories')}
            className="bg-sky-light border-b-4 border-sky-dark/20 rounded-3xl p-5 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all hover:brightness-105"
          >
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              🗣️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-cocoa/90">실전 회화 문장</h3>
              <p className="text-sm text-cocoa/60 font-medium">상황별로 골라서 말하기 연습</p>
            </div>
            <div className="bg-white/50 w-10 h-10 rounded-full flex items-center justify-center text-sky-dark font-bold">
              Go
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function MenuCard({ icon, title, subtitle, theme, onClick }: {
  icon: string, title: string, subtitle: string, theme: 'pink' | 'mint', onClick: () => void
}) {
  const styles = {
    pink: "bg-pink-light border-pink-dark/20",
    mint: "bg-mint-light border-mint-dark/20",
  }[theme];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-3xl flex items-center gap-4 text-left border-b-4 transition-all active:scale-[0.98] hover:brightness-105",
        styles
      )}
    >
      <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-cocoa/90">{title}</h3>
        <p className="text-sm text-cocoa/60 font-medium">{subtitle}</p>
      </div>
    </button>
  );
}
