import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="px-6 pb-5 pt-12 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Daily Talk JP</h1>
          <span className="text-sm text-gray-400 font-medium">오늘의 일본어 한 문장</span>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="설정"
        >
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">

        {/* Section 1: Basic Learning */}
        <div className="mb-4">
          <div className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            학습 모드 선택
          </div>

          {/* Kana Card */}
          <MenuCard
            icon="🐣"
            title="기초 다지기"
            desc="히라가나/가타카나부터" // Line break handled by UI logic if needed, or simple text
            theme="yellow"
            onClick={() => navigate('/kana')}
          />

          {/* Word Card */}
          <MenuCard
            icon="🖼️"
            title="그림 단어 퀴즈"
            desc="이미지로 연상하며 필수 단어 암기"
            theme="green"
            onClick={() => navigate('/word-pic')}
          />
        </div>

        {/* Spacer */}
        <div className="h-2"></div>

        {/* Section 2: Real Conversation */}
        <div className="mb-4">
          <div className="text-lg font-bold text-gray-800 mb-4 text-blue-600">
            🔥 도전! 실전 회화
          </div>

          {/* Talk Card (Special Style) */}
          <div
            onClick={() => navigate('/categories')}
            className="group relative flex items-center p-5 bg-blue-50/50 border-2 border-blue-100 rounded-[20px] 
            cursor-pointer active:scale-95 transition-all duration-150 shadow-sm hover:border-blue-200"
          >
            <div className="w-[56px] h-[56px] rounded-2xl bg-blue-500 text-white flex justify-center items-center text-3xl mr-4 shadow-lg shadow-blue-200">
              🗣️
            </div>
            <div className="flex-1">
              <div className="text-[17px] font-bold text-blue-600 mb-1">상황별 문장 학습</div>
              <div className="text-[13px] text-gray-500 leading-tight">
                연애, 비즈니스, 여행 등<br />원하는 상황을 골라보세요
              </div>
            </div>
            <div className="text-blue-400 text-xl font-bold ml-2">›</div>
          </div>
        </div>

      </main>

      {/* Tab Bar (Visual Only) */}
      <nav className="h-[80px] bg-white border-t border-gray-100 flex justify-around items-center pb-5">
        <TabItem icon="🏠" label="홈" active />
        <TabItem icon="📊" label="통계" />
        <TabItem icon="👤" label="내 정보" />
      </nav>
    </div>
  );
}

// --- Sub Components ---

interface MenuCardProps {
  icon: string;
  title: string;
  desc: string;
  theme: 'yellow' | 'green';
  onClick: () => void;
}

function MenuCard({ icon, title, desc, theme, onClick }: MenuCardProps) {
  const themeStyles = {
    yellow: {
      bg: 'hover:border-yellow-300',
      icon: 'bg-yellow-bg',
    },
    green: {
      bg: 'hover:border-green-300',
      icon: 'bg-green-bg',
    }
  };

  const style = themeStyles[theme];

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-5 bg-white border border-transparent rounded-[20px] mb-4 
      shadow-[0_4px_15px_rgba(0,0,0,0.03)] cursor-pointer active:scale-95 transition-all duration-150 
      ${style.bg}`}
    >
      <div className={`w-[56px] h-[56px] rounded-2xl flex justify-center items-center text-3xl mr-4 ${style.icon}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[17px] font-bold text-gray-800 mb-1">{title}</div>
        <div className="text-[13px] text-gray-400 leading-tight">{desc}</div>
      </div>
      <div className="text-gray-300 text-xl font-bold ml-2">›</div>
    </div>
  );
}

function TabItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${active ? 'text-gray-900' : 'text-gray-300'}`}>
      <span className="text-2xl mb-0.5">{icon}</span>
      {label}
    </div>
  );
}
