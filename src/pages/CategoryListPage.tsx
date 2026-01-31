import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../lib/apiClient';
import type { Category } from '../types';
import { cn } from '../lib/utils';

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <header className="px-4 pb-4 pt-10 flex items-center sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white text-cocoa rounded-2xl shadow-soft hover:brightness-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-xl font-extrabold text-center text-cocoa mr-12">
          상황별 회화
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
        <div className="text-2xl font-extrabold text-cocoa mb-8 leading-snug">
          어떤 상황에서<br />이야기 해볼까요?
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-white border-t-pink-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-10">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => navigate(`/quiz/${cat.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CategoryCard({ category, onClick }: { category: Category; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-8 px-2 rounded-3xl",
        "relative overflow-hidden transition-all active:scale-[0.96] shadow-soft hover:brightness-105",
        "bg-white border-2 border-transparent", // Base
        category.color // This usually has bg-red-50 etc. We might want to override or ensure it looks good.
        // Assuming category.color provides background colors like 'bg-red-50 text-red-500'
      )}
    >
      <div className="text-5xl mb-4 drop-shadow-sm transform group-hover:scale-110 transition-transform">
        {category.icon}
      </div>
      <div className="text-base font-extrabold text-center leading-tight text-cocoa">
        {category.title}
      </div>
    </button>
  );
}
