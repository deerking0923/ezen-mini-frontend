# 프로젝트 개요

프로젝트 이름: korea-sky-planner

설명: 한국 유저들을 위한 스카이 계획표 사이트. 키재기와 양초 계산 기능을 제공해준다.

사이트 URL: https://korea-sky-planner.com/

## 기술 스택
| Category | Technologies |
|----------|--------------|
| Architecture | Layered Architecture (Frontend 단 분리 구조) |
| Framework | Next.js (JavaScript) |
| Styling | CSS Modules|
| Data Fetching | Axios |
| Analytics | Google Analytics |
| Deployment & CI/CD | GitHub Actions, AWS EC2, NGINX |
| Domain Management | Gabia (SSL 인증서, DNS 설정) |
| Dev Environment | VS Code, Chrome DevTools |

## 학습 포인트
- 실제 사용자 대상 UX/UI 설계 및 반영  
- 도메인 구매 및 SSL 인증 설정 경험 (Gabia)  
- Google Analytics를 통한 사용자 행동 추적 적용  
- GitHub Actions 기반 CI/CD 및 AWS EC2 배포 경험


## 버전 정보
- 2.2.0 (2025-03-02) - 유랑 대백과 기능 추가. 크레딧 추가.
- 2.1.0 (2025-02-21) - 양초 계산기 페이지 추가. 메인 페이지에 키재기/양초계산기로 갈 수 있는 URL 추가.
- 2.0.0 (2025-02-08) - 사이트 컨셉 초기화. 키재는 사이트. 기존 기능도 url만 바꿈.
- 1.3.0 (2025-01-09) - 반응형 디자인 추가

## 설치 및 실행 방법

1. 필요한 소프트웨어 설치 (Node.js 18 이상)
2. 프로젝트 클론

```bash
git clone https://github.com/deerking0923/ezen-mini-frontend.git
```

3. 의존성 설치

```bash
npm install
```

4. 실행

```bash
npm run dev

```

6. 애플리케이션 접속
- 로컬 서버: [http://localhost:3000](http://localhost:3000/)


## 주요 기능

- 스카이 캐릭터 키 재기기
- 스카이 양초 재화 계산하기
- 스카이 유랑 정보를 볼 수 있는 유랑 대백과
- 페이지별 동적 라우팅 처리

## 참고 사항

- GitHub Actions를 사용한 CI/CD
- 구글 애널리틱스으로 사용자 로그 추적
