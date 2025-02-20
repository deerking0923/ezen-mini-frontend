// export function sumWantedCost(node, nodeStates) {
//     let sum = 0;
//     const mainSt = nodeStates[node.id] || "none";
//     if (mainSt === "want") {
//       sum += node.cost || 0;
//     }
//     if (node.seasonChild) {
//       const scId = node.seasonChild.id;
//       const scSt = nodeStates[scId] || "none";
//       if (scSt === "want") {
//         sum += node.seasonChild.cost || 0;
//       }
//     }
//     if (node.children) {
//       for (let c of node.children) {
//         sum += sumWantedCost(c, nodeStates);
//       }
//     }
//     return sum;
//   }
  

// utils/candleUtils.js

export function sumWantedCost(mainArray, seasonArray, nodeStates) {
  let sum = 0;

  // 메인 노드
  mainArray.forEach((node) => {
    const st = nodeStates[node.id] || "none";
    if (st === "want") {
      sum += node.cost || 0;
    }
  });

  // 시즌 노드
  seasonArray.forEach((sn) => {
    const st = nodeStates[sn.id] || "none";
    if (st === "want") {
      sum += sn.cost || 0;
    }
  });

  return sum;
}
