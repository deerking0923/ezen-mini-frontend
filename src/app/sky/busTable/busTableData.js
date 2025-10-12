// src/app/sky/busTable/busTableData.js

export const mainRoute = {
  ko: [
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
        { id: 'shell', name: '간헐천' }
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
        { id: 'green', name: '녹즙맵' },
        { id: 'wood', name: '나무집' }
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
        { id: 'hermit', name: '은둔자의 언덕' },
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
  ],
  en: [
    {
      id: 'isle',
      name: 'Isle of\nDawn',
      color: '#FFB6C1',
      icon: '⭐',
      subLocations: [
        { id: 'prophecy', name: 'Cave of Prophecy' },
        { id: 'water', name: 'Water Trial' },
        { id: 'earth', name: 'Earth Trial' },
        { id: 'air', name: 'Air Trial' },
        { id: 'fire', name: 'Fire Trial' }
      ]
    },
    {
      id: 'prairie',
      name: 'Daylight\nPrairie',
      color: '#FFD700',
      icon: '☀️',
      subLocations: [
        { id: 'prairie-peak', name: 'Prairie Peak' },
        { id: 'paradise', name: 'Paradise\nIsland' },
        { id: 'turtle', name: 'Turtle' },
        { id: 'shell', name: 'Geyser' }
      ]
    },
    {
      id: 'forest',
      name: 'Hidden\nForest',
      color: '#87CEEB',
      icon: '🌲',
      subLocations: [
        { id: 'wind', name: 'Wind Paths' },
        { id: 'dduk', name: 'Granny' },
        { id: 'green', name: 'Forest\nGarden' },
        { id: 'wood', name: 'Treehouse' }
      ]
    },
    {
      id: 'valley',
      name: 'Valley of\nTriumph',
      color: '#FFA500',
      icon: '⛰️',
      subLocations: [
        { id: 'race-land', name: 'Sliding Race' },
        { id: 'race-sky', name: 'Flying Race' },
        { id: 'dream', name: 'Village of\nDreams' },
        { id: 'hermit', name: 'Yeti House' },
        { id: 'theater', name: 'Village\nTheater' },
      ]
    },
    {
      id: 'wasteland',
      name: 'Golden\nWasteland',
      color: '#CD853F',
      icon: '🏜️',
      subLocations: [
        { id: 'ark', name: 'Forgotten\nArk' },
        { id: 'treasure', name: 'Treasure\nReef' }
      ]
    },
    {
      id: 'vault',
      name: 'Vault of\nKnowledge',
      color: '#4169E1',
      icon: '📚',
      subLocations: [
        { id: 'office', name: 'Office' }
      ]
    },
    {
      id: 'eden',
      name: 'Eye of\nEden',
      color: '#8B0000',
      icon: '👁️',
      subLocations: []
    }
  ]
};

export const seasonMaps = {
  ko: [
    { id: 'starlight', name: '별빛사막', icon: '⭐' },
    { id: 'oasis', name: '초승달 오아시스', icon: '🌙' },
    { id: 'moomin', name: '무민 밸리', icon: '🏔️' },
    { id: 'alice', name: '앨리스 카페', icon: '☕' }
  ],
  en: [
    { id: 'starlight', name: 'Starlight Desert', icon: '⭐' },
    { id: 'oasis', name: 'Crescent Oasis', icon: '🌙' },
    { id: 'moomin', name: 'Moomin Valley', icon: '🏔️' },
    { id: 'alice', name: 'Alice Cafe', icon: '☕' }
  ]
};

export const guideCategories = {
  ko: {
    info: {
      title: '📋 안내 사항',
      items: [
        {
          id: 'type',
          icon: '🚌',
          title: '운행 유형',
          options: ['양작', '날작', '염작', '에덴'],
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
          title: '일일퀘스트',
          options: ['포함', '미포함'],
          multiple: true
        },
        {
          id: 'fragment',
          icon: '✨',
          title: '파편',
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
          options: ['손은 먼저 잡아주세요!', '제가 내밀게요!'],
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
          options: ['삥 연타', '앉으면', '채팅할게요!'],
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
          id: 'instrument',
          icon: '🎵',
          title: '악기연주',
          options: ['가능해요', '조용히 갈래요'],
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
  },
  en: {
    info: {
      title: '📋 Information',
      items: [
        {
          id: 'type',
          icon: '🚌',
          title: 'Run Type',
          options: ['CandleRun', 'Wing Buff', 'Dye Run', 'Eden'],
          multiple: true
        },
        {
          id: 'people',
          icon: '👥',
          title: 'Group Size',
          options: ['1 Person', '2 People', '3+ People'],
          multiple: true
        },
        {
          id: 'time',
          icon: '⏰',
          title: 'Estimated Time',
          options: ['30 min', '1 hour', '1+ hours'],
          multiple: true
        },
        {
          id: 'home',
          icon: '🛖',
          title: 'Home Space',
          options: ['Home', 'Aviary Village'],
          multiple: true
        },
        {
          id: 'quest',
          icon: '📝',
          title: 'Dailies',
          options: ['Included', 'Not Included'],
          multiple: true
        },
        {
          id: 'fragment',
          icon: '✨',
          title: 'Shards',
          options: ['Included', 'Not Included'],
          multiple: true
        },
        {
          id: 'friend',
          icon: '💫',
          title: 'Friend Status',
          options: ['Remove Friend', 'Keep Friend', 'No Preference'],
          multiple: true
        }
      ]
    },
    etiquette: {
      title: '🤝 Etiquette',
      items: [
        {
          id: 'hand',
          icon: '🤝',
          title: 'Hand Holding',
          options: ['Please hold hands first!'],
          multiple: true
        },
        {
          id: 'calling',
          icon: '💫',
          title: 'Honking',
          options: ['Check screen when honked!'],
          multiple: true
        },
        {
          id: 'rest',
          icon: '🏠',
          title: 'Going Home',
          options: ['Rapid honk', 'Sit down', 'Will chat!'],
          multiple: true
        },
        {
          id: 'candle',
          icon: '🕯️',
          title: 'Candles',
          options: ['No preference', 'Light together'],
          multiple: true
        },
        {
          id: 'instrument',
          icon: '🎵',
          title: 'Instruments',
          options: ['Play anytime!', 'Prefer quiet'],
          multiple: true
        },
        {
          id: 'dive',
          icon: '🌊',
          title: 'AFK',
          options: ['Allowed', 'Not allowed'],
          multiple: true
        },
        {
          id: 'server',
          icon: '⛵',
          title: 'Server Split',
          options: ['I will join', 'Please join me'],
          multiple: true
        }
      ]
    }
  }
};

export const translations = {
  ko: {
    title: '🚌 Sky 버스 노선표',
    driverLabel: '버스 기사',
    driverPlaceholder: '이름 입력',
    introPlaceholder: '소개 문구',
    seasonMapTitle: '✨ 시즌맵',
    downloadButton: '📥다운로드'
  },
  en: {
    title: '🚌 Sky Uber Table',
    driverLabel: 'Uber Driver',
    driverPlaceholder: 'Enter name',
    introPlaceholder: 'Introduction',
    seasonMapTitle: '✨ Season Maps',
    downloadButton: '📥Download'
  }
};