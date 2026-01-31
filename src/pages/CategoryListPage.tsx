import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../lib/apiClient';
import type { Category } from '../types';
import { cn } from '../lib/utils'; // Assuming cn utility is implemented

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Categories
    const fetchData = async () => {
      try {
        const data = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-2 pb-3 pt-12 flex items-center bg-white/95 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-center text-gray-800 mr-11">
          실전 회화 주제
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
        <div className="text-xl font-bold text-gray-800 mb-6 leading-snug">
          어떤 상황을<br />연습해 볼까요?
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
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
  // Extract color classes from the string "bg-red-50 text-red-500 border-red-100"
  // Assuming the color string in mocked data is exactly space separated classes.
  // We can pass them directly to className.

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-6 px-3 rounded-[24px]",
        "border border-transparent cursor-pointer active:scale-95 transition-all duration-150",
        "shadow-sm hover:shadow-md",
        category.color // Apply custom color classes from data
      )}
    >
      <div className="text-[42px] mb-3 drop-shadow-sm select-none">
        {category.icon}
      </div>
      <div className={cn(
        "text-[15px] font-bold text-center break-keep leading-tight",
        // Extract text color from category.color or imply it. 
        // Actually the category.color string has 'text-red-500', so it applies automatically.
      )}>
        {category.title.split(' ').map((word, i) => (
          <span key={i} className="block">{word}</span>
        ))}
      </div>
    </div>
  );
}
