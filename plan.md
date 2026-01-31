당신은 '모바일 웹뷰(WebView) 앱 전문 수석 프론트엔드 개발자'입니다.
현재 기획된 일본어 학습 앱 **'Daily Talk JP'**를 **React + TypeScript + Tailwind CSS**로 구축 중입니다.

## 기술 스택
- Framework: React (Vite)
- Language: TypeScript (TSX)
- Styling: Tailwind CSS (모바일 반응형, WebView 최적화)
- Routing: react-router-dom
- Icons: lucide-react

## 핵심 디렉터리 구조
- `src/components`: 재사용 컴포넌트
- `src/pages`: 페이지 컴포넌트
- `src/layouts`: 레이아웃 (MainLayout)
- `src/types`: 공용 타입 정의
- `src/lib`: 데이터 및 유틸



# [Step 1] 프로젝트 기초 세팅 및 공통 모듈 구현

다음 파일들의 코드를 작성해주세요.

1. **`src/types/index.ts`**:
   - `Chunk` (id, text, meaning, width)
   - `QuizData` (id, krPrompt, chunks 등)
   - `KanaData` (sound, char)
   - `WordPicData` (id, imageUrl, krWord, options[], answer)
   - `Category` (id, title, icon, color) 인터페이스 정의.

2. **`src/lib/mockData.ts`**:
   - `categories`: 6가지 주제 (romance, daily, biz 등) 데이터.
   - `kanaData`: 히라가나 퀴즈용 더미 데이터.
   - `wordPicData`: 그림 퀴즈용 더미 데이터 (이미지 URL 포함).
   - `sentenceQuizData`: 카테고리별 문장 퀴즈 데이터.

3. **`src/index.css`**:
   - Tailwind Directives.
   - **WebView 최적화:** `user-select: none`, `-webkit-tap-highlight-color: transparent`, `overscroll-behavior: none`, `safe-area-inset` 대응.

4. **`src/layouts/MainLayout.tsx`**:
   - `Outlet`을 감싸는 컨테이너.
   - 모바일 뷰포트(max-width 제한 등) 및 Safe Area Padding 적용.

5. **`src/routes/AppRoutes.tsx`**:
   - `/`, `/kana`, `/word-pic`, `/categories`, `/quiz/:categoryId` 라우트 정의.

6. **`src/App.tsx`**:
   - `AppRoutes`를 렌더링.


# [Step 2] 홈 화면 및 카테고리 목록 구현

이미 정의된 `MainLayout`과 `mockData`를 활용하여 다음 페이지를 구현해주세요.

1. **`src/pages/HomePage.tsx`**:
   - **Header:** 로고 및 설정 아이콘.
   - **Section 1 (기초):** '히라가나/가타카나' 카드 (Yellow Theme) -> `/kana` 이동.
   - **Section 2 (단어):** '그림 단어 퀴즈' 카드 (Green Theme) -> `/word-pic` 이동.
   - **Section 3 (회화):** '실전 회화 주제' 카드 (Blue Theme, 강조 스타일) -> `/categories` 이동.
   - **UI:** 카드 터치 시 `active:scale-95` 애니메이션 필수.

2. **`src/pages/CategoryListPage.tsx`**:
   - **Header:** 뒤로가기(`<`) 버튼 + 타이틀 "실전 회화 주제".
   - **Grid:** `mockData.categories`를 불러와 2열 그리드로 표시.
   - **Card:** 각 카드는 아이콘, 제목을 포함하며 클릭 시 `/quiz/{categoryId}`로 이동.
   ```typescript
// Categories Data (CategoryListPage에서 사용)
export const categories = [
  { id: 'romance', title: "이성과의 대화", icon: "❤️", color: "bg-red-50 text-red-500 border-red-100" },
  { id: 'daily', title: "일상 루틴", icon: "☀️", color: "bg-orange-50 text-orange-500 border-orange-100" },
  { id: 'friend', title: "친구와 술자리", icon: "🍺", color: "bg-blue-50 text-blue-500 border-blue-100" },
  { id: 'biz', title: "비즈니스", icon: "💼", color: "bg-gray-50 text-gray-600 border-gray-200" },
  { id: 'travel', title: "여행지에서", icon: "✈️", color: "bg-green-50 text-green-500 border-green-100" },
  { id: 'emotion', title: "감정 표현", icon: "🤔", color: "bg-purple-50 text-purple-500 border-purple-100" }
];


# [Step 3] 기초 학습 페이지 구현 (Kana & WordPic)

다음 두 가지 퀴즈 페이지를 구현해주세요.

1. **`src/pages/KanaQuizPage.tsx`**:
   - **Logic:** `mockData.kanaData` 활용. 4지 선다 스피드 퀴즈.
   - **UI:** 상단에 큰 한국어 발음("아") -> 하단 4개 일본어 카드 중 선택.
   - **Feedback:** 정답 시 초록색 + 자동 다음 문제 / 오답 시 빨간색 + Shake 애니메이션.

2. **`src/pages/WordPicQuizPage.tsx`**:
   - **Logic:** `mockData.wordPicData` 활용. 이미지 연상 퀴즈.
   - **UI:** 중앙 이미지 + 한글 단어 -> 하단 일본어 단어 칩 선택.
   - **Feedback:** 정답 시 폭죽(🎉) 효과 또는 텍스트 칭찬 후 다음 문제.


# [Step 4] 핵심 기능: 문장 학습 페이지 (SentenceQuizPage)

이 앱의 가장 중요한 페이지인 **`src/pages/SentenceQuizPage.tsx`**를 구현해주세요.

## 기능 요구사항
1. **Header:** - URL 파라미터(`categoryId`)로 `categories` 데이터를 조회하여 헤더 타이틀(아이콘+제목) 표시.
   - 뒤로가기 버튼.

2. **Dual Mode (Toggle Switch):**
   - **Easy Mode:** 하단에 흩어진 '단어 칩'을 클릭하여 빈칸 채우기. (드래그 아님, 클릭 방식)
   - **Hard Mode:** 빈칸(`<input>`)에 키보드로 직접 타이핑. 각 칸 위에 '힌트(💡)' 버튼 있음.

3. **AI Feedback Simulation:**
   - [검사 받기] 버튼 클릭 시 -> `isLoading` 상태(API 호출 중) -> 결과 모달(Bottom Sheet) 등장.
   - 모달 내용은 정답 여부에 따라 다르게 표시 (정답: 🎉 / 오답: 👨‍🏫 + 교정).

4. **Data:** `mockData.sentenceQuizData` 사용.
5. **Styling:** `index.css`의 웹뷰 스타일과 Tailwind를 활용하여 네이티브 앱 같은 퀄리티 유지.