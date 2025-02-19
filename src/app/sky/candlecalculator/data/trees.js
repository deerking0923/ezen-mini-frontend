// data/trees.js

// 아래 형태:
// node1 -> children: [ node2 -> children: [ node3 -> ... node8 ] ]
// node1~node7은 seasonChild가 있고, node8은 seasonChild null

export const soul1Tree = {
  id: "node1",
  name: "Node 1",
  cost: 0,
  seasonChild: { id: "child1", name: "SeasonChild1", cost: 0 },
  children: [
    {
      id: "node2",
      name: "Node 2",
      cost: 12,
      seasonChild: { id: "child2", name: "SeasonChild2", cost: 0 },
      children: [
        {
          id: "node3",
          name: "Node 3",
          cost: 16,
          seasonChild: { id: "child3", name: "SeasonChild3", cost: 0 },
          children: [
            {
              id: "node4",
              name: "Node 4",
              cost: 20,
              seasonChild: { id: "child4", name: "SeasonChild4", cost: 0 },
              children: [
                {
                  id: "node5",
                  name: "Node 5",
                  cost: 24,
                  seasonChild: { id: "child5", name: "SeasonChild5", cost: 0 },
                  children: [
                    {
                      id: "node6",
                      name: "Node 6",
                      cost: 28,
                      seasonChild: { id: "child6", name: "SeasonChild6", cost: 0 },
                      children: [
                        {
                          id: "node7",
                          name: "Node 7",
                          cost: 32,
                          seasonChild: { id: "child7", name: "SeasonChild7", cost: 0 },
                          children: [
                            {
                              id: "node8",
                              name: "Node 8",
                              cost: 3,
                              seasonChild: null,
                              children: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const soul2Tree = {
  id: "node1",
  name: "Node 1",
  cost: 0,
  seasonChild: { id: "child1", name: "SeasonChild1", cost: 0 },
  children: [
    {
      id: "node2",
      name: "Node 2",
      cost: 10,
      seasonChild: { id: "child2", name: "SeasonChild2", cost: 0 },
      children: [
        {
          id: "node3",
          name: "Node 3",
          cost: 14,
          seasonChild: { id: "child3", name: "SeasonChild3", cost: 0 },
          children: [
            {
              id: "node4",
              name: "Node 4",
              cost: 18,
              seasonChild: { id: "child4", name: "SeasonChild4", cost: 0 },
              children: [
                {
                  id: "node5",
                  name: "Node 5",
                  cost: 24,
                  seasonChild: { id: "child5", name: "SeasonChild5", cost: 0 },
                  children: [
                    {
                      id: "node6",
                      name: "Node 6",
                      cost: 32,
                      seasonChild: { id: "child6", name: "SeasonChild6", cost: 0 },
                      children: [
                        {
                          id: "node7",
                          name: "Node 7",
                          cost: 38,
                          seasonChild: { id: "child7", name: "SeasonChild7", cost: 0 },
                          children: [
                            {
                              id: "node8",
                              name: "Node 8",
                              cost: 3,
                              seasonChild: null,
                              children: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const soul3Tree = {
  id: "node1",
  name: "Node 1",
  cost: 0,
  seasonChild: { id: "child1", name: "SeasonChild1", cost: 0 },
  children: [
    {
      id: "node2",
      name: "Node 2",
      cost: 14,
      seasonChild: { id: "child2", name: "SeasonChild2", cost: 0 },
      children: [
        {
          id: "node3",
          name: "Node 3",
          cost: 16,
          seasonChild: { id: "child3", name: "SeasonChild3", cost: 0 },
          children: [
            {
              id: "node4",
              name: "Node 4",
              cost: 18,
              seasonChild: { id: "child4", name: "SeasonChild4", cost: 0 },
              children: [
                {
                  id: "node5",
                  name: "Node 5",
                  cost: 20,
                  seasonChild: { id: "child5", name: "SeasonChild5", cost: 0 },
                  children: [
                    {
                      id: "node6",
                      name: "Node 6",
                      cost: 24,
                      seasonChild: { id: "child6", name: "SeasonChild6", cost: 0 },
                      children: [
                        {
                          id: "node7",
                          name: "Node 7",
                          cost: 28,
                          seasonChild: { id: "child7", name: "SeasonChild7", cost: 0 },
                          children: [
                            {
                              id: "node8",
                              name: "Node 8",
                              cost: 3,
                              seasonChild: null,
                              children: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};


// 예시로 soul2, soul3도 동일한 구조
//export const soul2Tree = soul1Tree;
//export const soul3Tree = soul1Tree;
