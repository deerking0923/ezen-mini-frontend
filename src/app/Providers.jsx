'use client';

import { QuizProvider } from './sky/context/QuizContext';

/** 모든 전역 Provider를 여기서 래핑 */
export default function Providers({ children }) {
  return <QuizProvider>{children}</QuizProvider>;
}
