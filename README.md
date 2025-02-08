# 프로젝트 개요

프로젝트 이름: 게임 캐릭터 키재기 사이트

설명: Sky 게임 캐릭터의 키를 잴 수 있는 사이트이다.

## 기술 스택

- Next.js 15
- CI/CD (GitHub Actions)
- RESTful API 연동
- JS/CSS/HTML
- JAVA 17
- Maven

## 버전 정보

- 2.0.0 (2025-02-08) - 사이트 컨셉 초기화. 키재는 사이트. 기존 기능도 url만 바꿈.
- 1.3.0 (2025-01-09) - 반응형 디자인 추가
- 1.2.0 (2025-01-08) - 토론 채팅방 추가
- 1.0.1 (2025-01-07) - 국어사전 위젯 추가
- 1.0.0 (2025-01-07) - 기본 UI 구성, 글/답변 페이지 구현, 랜덤 문장 받아오기 기능, API 연동 완료. 날씨 API 적용.

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

4. .env 파일 설정

```
NEXT_PUBLIC_WEATHER_API_KEY=
```

5. 실행

```bash
npm run dev

```

6. 애플리케이션 접속
- 로컬 서버: [http://localhost:3000](http://localhost:3000/)


## 프로젝트 구조

```bash
src/
├── app/
│   ├── answers/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.js           # 답변 수정 페이지
│   │   └── page.js                   # 답변 리스트 페이지
│   ├── questions/
│   │   ├── [id]/
│   │   │   ├── edit/
│   │   │   │   └── page.js           # 질문 수정 페이지
│   │   │   └── detail.css            # 질문 상세 페이지 스타일
│   │   ├── create/
│   │   │   └── page.js               # 질문 생성 페이지
│   │   ├── random/
│   │   │   └── page.js               # 랜덤 질문 페이지
│   │   └── page.js                   # 질문 리스트 페이지
│   ├── globals.css                   # 전역 스타일
│   ├── layout.css                    # 레이아웃 스타일
│   ├── layout.js                     # 기본 레이아웃 컴포넌트
│   └── page.js                       # 메인 페이지
├── public/                           # 정적 파일 (favicon 등)
├── .github/workflows/                # GitHub Actions 워크플로우 파일
├── next.config.js                    # Next.js 설정 파일
├── package.json                      # 의존성 및 스크립트 관리 파일                      
└── README.md                         # 프로젝트 설명 파일

```

## 주요 폴더 설명

### **app/questions**

- **[id]**: 특정 질문에 대한 세부 정보 처리.
    - `edit/page.js`: 질문 수정 페이지.
- **create/page.js**: 새 질문을 생성하는 페이지.
- **random/page.js**: 랜덤 질문을 출력하는 페이지.
- **page.js**: 질문 목록 페이지.

### **app/answers**

- **[id]/edit/page.js**: 특정 답변 수정 페이지.
- **page.js**: 답변 목록 페이지.

### **globals.css**

- Tailwind CSS를 활용한 전역 스타일 정의.

### **layout.js**

- 공통 레이아웃 컴포넌트로, 모든 페이지의 기본 구조를 정의.

## 주요 기능

- 스카이 캐릭터 키 재기기
- 랜덤 질문 받아오기 (RESTful API 연동)
- 질문 생성, 수정, 삭제
- 답변 작성 및 수정
- 페이지별 동적 라우팅 처리

## 참고 사항

- 백엔드 API URL은 `.env` 파일에서 관리됩니다.
- GitHub Actions를 사용한 CI/CD 워크플로우가 포함되어 있습니다.

## 참고 OPEN API

- [Weather API](https://www.weatherapi.com/)
