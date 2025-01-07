# 프로젝트 개요

프로젝트 이름: 나만의 문장을 만나다 (프론트엔드)

설명: 좋아하는 문장들을 가득 담아 매일 랜덤으로 받아보는 인문학 아카이브의 프론트엔드 애플리케이션.

## 기술 스택

- Next.js 13
- CI/CD (GitHub Actions)
- RESTful API 연동

## 버전 정보

- 1.0.0 (2025-01-07) - 기본 UI 구성, 글/답변 페이지 구현, 랜덤 문장 받아오기 기능, API 연동 완료. 날씨 API 적용.

## 설치 및 실행 방법

1. 필요한 소프트웨어 설치 (Node.js 18 이상)
2. 프로젝트 클론

```bash
git clone https://github.com/deerking0923/ezen-mini-frontend.git
```

1. 의존성 설치

```bash
npm install
```

1. .env 파일 설정

```
NEXT_PUBLIC_WEATHER_API_KEY=
```

1. 실행

```bash
npm run dev

```

1. 애플리케이션 접속
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

- 랜덤 질문 받아오기 (RESTful API 연동)
- 질문 생성, 수정, 삭제
- 답변 작성 및 수정
- 페이지별 동적 라우팅 처리

## 참고 사항

- 백엔드 API URL은 `.env` 파일에서 관리됩니다.
- GitHub Actions를 사용한 CI/CD 워크플로우가 포함되어 있습니다.

## 참고 OPEN API

- [Weather API](https://www.weatherapi.com/)