import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function KanaSelectionPage() {
  const navigate = useNavigate();
  const [rowType, setRowType] = useState<'hiragana' | 'katakana'>('hiragana');

  return (
    <div className="flex flex-col h-full bg-cream relative">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex items-center z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-2xl shadow-soft text-cocoa transition-all hover:brightness-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-cocoa mr-12">
          기초 다지기
        </h1>
      </header>

      <main className="flex-1 px-6 pb-10 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        {/* Main Selection Cards */}
        <SelectionCard
          title="히라가나 (전체)"
          subtitle="Hiragana All"
          icon="あ"
          theme="yellow"
          onClick={() => navigate('/kana/quiz?type=hiragana')}
        />

        <SelectionCard
          title="가타카나 (전체)"
          subtitle="Katakana All"
          icon="ア"
          theme="green"
          onClick={() => navigate('/kana/quiz?type=katakana')}
        />

        {/* Row Selection Section */}
        <div className="mt-4 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-cocoa font-bold text-lg">단별로 연습하기</h3>

            {/* Toggle Switch */}
            <div className="bg-white p-1 rounded-full border border-gray-100 shadow-sm flex">
              <button
                onClick={() => setRowType('hiragana')}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all",
                  rowType === 'hiragana' ? "bg-yellow-100 text-yellow-700 shadow-sm" : "text-gray-400"
                )}
              >
                あ Hiragana
              </button>
              <button
                onClick={() => setRowType('katakana')}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all",
                  rowType === 'katakana' ? "bg-mint-light text-mint-dark shadow-sm" : "text-gray-400"
                )}
              >
                ア Katakana
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {[
              { id: 'a', h: 'あ', k: 'ア' },
              { id: 'ka', h: 'か', k: 'カ' },
              { id: 'sa', h: 'さ', k: 'サ' },
              { id: 'ta', h: 'た', k: 'タ' },
              { id: 'na', h: 'な', k: 'ナ' },
              { id: 'ha', h: 'は', k: 'ハ' },
              { id: 'ma', h: 'ま', k: 'マ' },
              { id: 'ya', h: 'や', k: 'ヤ' },
              { id: 'ra', h: 'ら', k: 'ラ' },
              { id: 'wa', h: 'わ', k: 'ワ' },
            ].map((row) => (
              <button
                key={row.id}
                onClick={() => navigate(`/kana/quiz?type=${rowType}&row=${row.id}`)}
                className={cn(
                  "aspect-square bg-white rounded-2xl shadow-sm border-2 flex flex-col items-center justify-center active:scale-95 transition-all text-cocoa",
                  rowType === 'hiragana'
                    ? "border-yellow-100 hover:bg-yellow-50"
                    : "border-mint-light hover:bg-mint-light/50"
                )}
              >
                <span className="text-xl font-black mb-1">
                  {rowType === 'hiragana' ? row.h : row.k}
                </span>
                <span className="text-[10px] font-bold opacity-40 uppercase">{row.id}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SelectionCard({ title, subtitle, icon, theme, onClick }: {
  title: string, subtitle: string, icon: string, theme: 'yellow' | 'green', onClick: () => void
}) {
  const styles = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    green: "bg-mint-light border-mint-dark/30 text-mint-dark"
  }[theme];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-8 rounded-[32px] border-[3px] shadow-soft transition-all active:scale-95 active:shadow-none active:translate-y-[4px] hover:brightness-105",
        styles
      )}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center text-4xl font-black shadow-sm backdrop-blur-sm">
          {icon}
        </div>
        <div className="text-left">
          <div className="text-xl font-extrabold leading-tight">{title}</div>
          <div className="text-xs font-bold opacity-60 uppercase tracking-widest">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}
