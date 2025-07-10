/* 페이지 전용 metadata ― OG 대표 이미지 포함 */
export const metadata = {
  title: '스카이 플래너',
  description: 'Sky: Children of the Light 한국 유저를 위한 팬사이트',
  openGraph: {
    title: '스카이 플래너',
    description: 'Sky: Children of the Light 한국 유저를 위한 팬사이트',
    url: 'https://korea-sky-planner.com',
    siteName: '스카이 플래너',
    images: [
      'https://korea-sky-planner.com/sky/presentation.jpg', // 절대 URL!
    ],
    type: 'website',
  },
};

/* 클라이언트 전용 컴포넌트 불러오기 */
import MainPageClient from './MainPageClient';

export default function Page() {
  return <MainPageClient />;     /* 서버는 그냥 래핑만 */
}
