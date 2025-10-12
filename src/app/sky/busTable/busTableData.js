// src/app/sky/busTable/busTableData.js

export const mainRoute = [
  {
    id: 'isle',
    name: '여명의섬',
    color: '#FFB6C1',
    icon: '⭐',
    subLocations: [
      { id: 'prophecy', name: '예언의 동굴' },
      { id: 'water', name: '물의 시련' },
      { id: 'earth', name: '땅의 시련' },
      { id: 'air', name: '공기의 시련' },
      { id: 'fire', name: '불의 시련' }
    ]
  },
  {
    id: 'prairie',
    name: '햇빛 초원',
    color: '#FFD700',
    icon: '☀️',
    subLocations: [
      { id: 'prairie-peak', name: '초원 봉우리' },
      { id: 'paradise', name: '낙원의 섬' },
      { id: 'turtle', name: '거북이' },
      { id: 'shell', name: '조개' }
    ]
  },
  {
    id: 'forest',
    name: '비밀의 숲',
    color: '#87CEEB',
    icon: '🌲',
    subLocations: [
      { id: 'wind', name: '바람길' },
      { id: 'dduk', name: '떡집' },
      { id: 'green', name: '녹즙맵' }
    ]
  },
  {
    id: 'valley',
    name: '승리의 계곡',
    color: '#FFA500',
    icon: '⛰️',
    subLocations: [
              { id: 'race-land', name: '땅레이스' },
      { id: 'race-sky', name: '하늘레이스' },
      { id: 'dream', name: '꿈의 마을' },
      { id: 'theater', name: '마을 극장' },
    ]
  },
  {
    id: 'wasteland',
    name: '황금 황무지',
    color: '#CD853F',
    icon: '🏜️',
    subLocations: [
              { id: 'ark', name: '잊혀진 방주' },
      { id: 'treasure', name: '보물섬' }
    ]
  },
  {
    id: 'vault',
    name: '지식의 도서관',
    color: '#4169E1',
    icon: '📚',
    subLocations: [
      { id: 'office', name: '사무실' }
    ]
  },
  {
    id: 'eden',
    name: '에덴의 눈',
    color: '#8B0000',
    icon: '👁️',
    subLocations: []
  }
];

export const seasonMaps = [
  { id: 'starlight', name: '별빛사막', icon: '⭐' },
  { id: 'oasis', name: '초승달 오아시스', icon: '🌙' },
  { id: 'moomin', name: '무민 밸리', icon: '🏔️' },
  { id: 'city', name: '마지막 도시', icon: '🏙️' }
];

export const guideCategories = {
  info: {
    title: '📋 안내 사항',
    items: [
      {
        id: 'type',
        icon: '🚌',
        title: '운행 유형',
        options: ['양작', '날작', '염작', '환생'],
        multiple: true
      },
      {
        id: 'people',
        icon: '👥',
        title: '모집 인원',
        options: ['1명', '2명', '3명 이상'],
        multiple: true
      },
      {
        id: 'time',
        icon: '⏰',
        title: '예상 소요 시간',
        options: ['30분', '1시간', '1시간 이상'],
        multiple: true
      },
    {
        id: 'home',
        icon: '🛖',
        title: '안식처',
        options: ['구식처', '신식처'],
        multiple: true
      },
      {
        id: 'quest',
        icon: '📝',
        title: '일퀘',
        options: ['포함', '미포함'],
        multiple: true
      },
      {
        id: 'friend',
        icon: '💫',
        title: '친구 유무',
        options: ['친구 삭제', '빛친', '상관 없어요!'],
        multiple: true
      }
    ]
  },
  etiquette: {
    title: '🤝 모두의 에티켓',
    items: [
      {
        id: 'hand',
        icon: '🤝',
        title: '손발이 척척!',
        options: ['손은 먼저 잡아주세요!'],
        multiple: true
      },
            {
        id: 'calling',
        icon: '💫',
        title: '삥삥은 당신을 부르는 소리!',
        options: ['삥하면 화면을 봐주세요!'],
        multiple: true
      },
      {
        id: 'rest',
        icon: '🏠',
        title: '안식처를 갈 때는',
        options: ['삥 연타', '앉으면'],
        multiple: true
      },
      {
        id: 'candle',
        icon: '🕯️',
        title: '촛불',
        options: ['상관 없어요', '같이 들어주세요'],
        multiple: true
      },
      {
        id: 'dive',
        icon: '🌊',
        title: '잠수',
        options: ['가능', '불가능'],
        multiple: true
      },
      {
        id: 'server',
        icon: '⛵',
        title: '섭갈',
        options: ['제가 갈게요', '합류해주세요'],
        multiple: true
      }
    ]
  }
};