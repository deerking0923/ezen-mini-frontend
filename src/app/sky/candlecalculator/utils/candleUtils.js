export function sumWantedCost(node, nodeStates) {
    let sum = 0;
    const mainSt = nodeStates[node.id] || "none";
    if (mainSt === "want") {
      sum += node.cost || 0;
    }
    if (node.seasonChild) {
      const scId = node.seasonChild.id;
      const scSt = nodeStates[scId] || "none";
      if (scSt === "want") {
        sum += node.seasonChild.cost || 0;
      }
    }
    if (node.children) {
      for (let c of node.children) {
        sum += sumWantedCost(c, nodeStates);
      }
    }
    return sum;
  }
  