// 레벨별로 왼쪽 2열(일반), 오른쪽 1열(시즌)로 분리
export const spiritsData = [
  {
    id: 1,
    name: {
      ko: "이주하는 종치기",
      en: "Migrating Bellmaker"
    },
    totalCandles: 98,
    levels: [
      {
        level: 5,
        leftNodes: [],
        rightNodes: [{ id: "s1_l5_s1", type: "season", cost: 3 }]
      },
      {
        level: 4,
        leftNodes: [
          { id: "s1_l4_n1", type: "normal", cost: 36 },
          { id: "s1_l4_n2", type: "normal", cost: 0 }
        ],
        rightNodes: [{ id: "s1_l4_s1", type: "season", cost: 0 }],
      },
      {
        level: 3,
        leftNodes: [
          { id: "s1_l3_n1", type: "normal", cost: 9 },
          { id: "s1_l3_n2", type: "normal", cost: 6 }
        ],
        rightNodes: [{ id: "s1_l3_s1", type: "season", cost: 0 }]
      },
      {
        level: 2,
        leftNodes: [
          { id: "s1_l2_n1", type: "normal", cost: 23 },
          { id: "s1_l2_n2", type: "normal", cost: 4 }
        ],
        rightNodes: [{ id: "s1_l2_s1", type: "season", cost: 0 }]
      },
      {
        level: 1,
        leftNodes: [
          { id: "s1_l1_n1", type: "normal", cost: 0 },
          { id: "s1_l1_n2", type: "normal", cost: 17 }
        ],
        rightNodes: [{ id: "s1_l1_s1", type: "season", cost: 0 }]
      }
    ]
  },
  {
    id: 2,
    name: {
      ko: "이주하는 만타가오리 소리꾼",
      en: "Migrating Manta Whisperer"
    },
    totalCandles: 74,
    levels: [
      {
        level: 5,
        leftNodes: [],
        rightNodes: [{ id: "s2_l5_s1", type: "season", cost: 3 }]
      },
      {
        level: 4,
        leftNodes: [
          { id: "s2_l4_n1", type: "normal", cost: 12 },
          { id: "s2_l4_n2", type: "normal", cost: 0 }
        ],
        rightNodes: [
          { id: "s2_l4_s1", type: "season", cost: 0 },
          { id: "s2_l4_s2", type: "season", cost: 0 }
        ],
      },
      {
        level: 3,
        leftNodes: [
          { id: "s2_l3_n1", type: "normal", cost: 24 },
          { id: "s2_l3_n2", type: "normal", cost: 6 }
        ],
        rightNodes: [{ id: "s2_l3_s1", type: "season", cost: 0 }]
      },
      {
        level: 2,
        leftNodes: [
          { id: "s2_l2_n1", type: "normal", cost: 23 },
          { id: "s2_l2_n2", type: "normal", cost: 4 }
        ],
        rightNodes: [{ id: "s2_l2_s1", type: "season", cost: 0 }]
      },
      {
        level: 1,
        leftNodes: [
          { id: "s2_l1_n1", type: "normal", cost: 0 },
          { id: "s2_l1_n2", type: "normal", cost: 2 }
        ],
        rightNodes: [{ id: "s2_l1_s1", type: "season", cost: 0 }]
      }
    ]
  },
  {
    id: 3,
    name: {
      ko: "이주하는 나비조련사",
      en: "Migrating Butterfly Charmer"
    },
    totalCandles: 73,
    levels: [
      {
        level: 5,
        leftNodes: [],
        rightNodes: [{ id: "s3_l5_s1", type: "season", cost: 3 }]
      },
      {
        level: 4,
        leftNodes: [
          { id: "s3_l4_n1", type: "normal", cost: 8 },
          { id: "s3_l4_n2", type: "normal", cost: 0 }
        ],
        rightNodes: [
          { id: "s3_l4_s1", type: "season", cost: 0 },
          { id: "s3_l4_s2", type: "season", cost: 0 }
        ],
      },
      {
        level: 3,
        leftNodes: [
          { id: "s3_l3_n1", type: "normal", cost: 24 },
          { id: "s3_l3_n2", type: "normal", cost: 30 }
        ],
        rightNodes: [{ id: "s3_l3_s1", type: "season", cost: 0 }]
      },
      {
        level: 2,
        leftNodes: [
          { id: "s3_l2_n1", type: "normal", cost: 6 }
        ],
        rightNodes: [{ id: "s3_l2_s1", type: "season", cost: 0 }]
      },
      {
        level: 1,
        leftNodes: [
          { id: "s3_l1_n1", type: "normal", cost: 0 },
          { id: "s3_l1_n2", type: "normal", cost: 2 }
        ],
        rightNodes: [{ id: "s3_l1_s1", type: "season", cost: 0 }]
      }
    ]
  },
  {
    id: 4,
    name: {
      ko: "이주하는 새 소리꾼",
      en: "Migrating Bird Whisperer"
    },
    totalCandles: 75,
    levels: [
      {
        level: 5,
        leftNodes: [],
        rightNodes: [{ id: "s4_l5_s1", type: "season", cost: 3 }]
      },
      {
        level: 4,
        leftNodes: [
          { id: "s4_l4_n1", type: "normal", cost: 12 },
          { id: "s4_l4_n2", type: "normal", cost: 0 }
        ],
        rightNodes: [
          { id: "s4_l4_s1", type: "season", cost: 0 },
          { id: "s4_l4_s2", type: "season", cost: 0 }
        ],
      },
      {
        level: 3,
        leftNodes: [
          { id: "s4_l3_n1", type: "normal", cost: 24 },
          { id: "s4_l3_n2", type: "normal", cost: 30 }
        ],
        rightNodes: [{ id: "s4_l3_s1", type: "season", cost: 0 }]
      },
      {
        level: 2,
        leftNodes: [
          { id: "s4_l2_n1", type: "normal", cost: 4 }
        ],
        rightNodes: [{ id: "s4_l2_s1", type: "season", cost: 0 }]
      },
      {
        level: 1,
        leftNodes: [
          { id: "s4_l1_n1", type: "normal", cost: 0 },
          { id: "s4_l1_n2", type: "normal", cost: 2 }
        ],
        rightNodes: [{ id: "s4_l1_s1", type: "season", cost: 0 }]
      }
    ]
  },
  {
    id: 5,
    name: {
      ko: "이주하는 해파리 소리꾼",
      en: "Migrating Jelly Whisperer"
    },
    totalCandles: 78,
    levels: [
      {
        level: 5,
        leftNodes: [],
        rightNodes: [{ id: "s5_l5_s1", type: "season", cost: 3 }]
      },
      {
        level: 4,
        leftNodes: [
          { id: "s5_l4_n1", type: "normal", cost: 36 },
          { id: "s5_l4_n2", type: "normal", cost: 0 }
        ],
        rightNodes: [
          { id: "s5_l4_s1", type: "season", cost: 0 },
          { id: "s5_l4_s2", type: "season", cost: 0 }
        ],
      },
      {
        level: 3,
        leftNodes: [
          { id: "s5_l3_n1", type: "normal", cost: 24 },
          { id: "s5_l3_n2", type: "normal", cost: 9 }
        ],
        rightNodes: [{ id: "s5_l3_s1", type: "season", cost: 0 }]
      },
      {
        level: 2,
        leftNodes: [
          { id: "s5_l2_n1", type: "normal", cost: 4 }
        ],
        rightNodes: [{ id: "s5_l2_s1", type: "season", cost: 0 }]
      },
      {
        level: 1,
        leftNodes: [
          { id: "s5_l1_n1", type: "normal", cost: 0 },
          { id: "s5_l1_n2", type: "normal", cost: 2 }
        ],
        rightNodes: [{ id: "s5_l1_s1", type: "season", cost: 0 }]
      }
    ]
  },
];