export const dynamic = 'force-dynamic';   // SSG 비활성 (프리렌더 X)

import ResultClient from './ResultClient';

export default function ResultPage() {
  /* 서버에서는 아무 로직도 돌리지 않고,   */
  /* 클라이언트 컴포넌트를 그대로 내려보냅니다 */
  return <ResultClient />;
}
