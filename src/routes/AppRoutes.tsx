import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import CategoryListPage from '../pages/CategoryListPage';
import KanaSelectionPage from '../pages/KanaSelectionPage';
import KanaQuizPage from '../pages/KanaQuizPage';
import WordPicQuizPage from '../pages/WordPicQuizPage';
import SentenceQuizPage from '../pages/SentenceQuizPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/kana" element={<KanaSelectionPage />} />
        <Route path="/kana/quiz" element={<KanaQuizPage />} />
        <Route path="/word-pic" element={<WordPicQuizPage />} />
        <Route path="/quiz/:categoryId" element={<SentenceQuizPage />} />
      </Route>
    </Routes>
  );
}
