// 输入: ["aa.bb.cc", "bb.cc", "aa.cc"]
// 输出:[
//   {
//     titile: "aa",
//     parent: null,
//     id: "aa",
//     key: "aa",
//     children: [
//       {
//         title: "bb",
//         parent: "aa",
//         id: "aa.bb",
//         key: "aa.bb",
//         children: [
//           {
//             title: "cc",
//             parent: "aa.bb",
//             id: "aa.bb.cc",
//             key: "aa.bb.cc",
//             children: null,
//           },
//         ],
//       },
//       {
//         title: "cc",
//         parent: "aa",
//         id: "aa.cc",
//         key: "aa.cc",
//         children: null,
//       },
//     ],
//   },
//   {
//     title: "bb",
//     parent: null,
//     id: "bb",
//     key: "bb",
//     children: [
//       {
//         title: "cc",
//         parent: "bb",
//         id: "bb.cc",
//         key: "bb.cc",
//         children: null,
//       }
//     ],
//   }
// ];
function buildTree(paths) {
  // 字典: 使用 Map 来存储所有节点，键为节点的 id，方便快速查找
  const nodesMap = new Map();
  // 结果数组，存放所有根节点
  const result = [];

  // 遍历每个路径字符串
  paths.forEach((path) => {
    // 将路径按 '.' 分割成部分数组，如 ['aa', 'bb', 'cc']
    const parts = path.split(".");
    let parentId = null; // 当前处理部分的父节点 id，初始为 null（根节点）

    // 逐层处理每个部分
    for (let i = 0; i < parts.length; i++) {
      // 当前层级的部分数组，用于生成当前节点的 id
      const currentParts = parts.slice(0, i + 1);
      const id = currentParts.join(".");
      const title = parts[i]; // 当前节点的显示名称

      // 如果当前节点不存在，则创建新节点
      if (!nodesMap.has(id)) {
        const node = {
          title: title,
          parent: parentId,
          id: id,
          key: id,
          children: [], // 初始化为空数组，后续处理中若为空则转为 null
        };
        nodesMap.set(id, node); // 将新节点存入 Map

        // 如果父节点为 null，说明是根节点，添加到结果数组
        if (parentId === null) {
          result.push(node);
        } else {
          // 否则找到父节点，将当前节点添加到父节点的 children 中
          const parentNode = nodesMap.get(parentId);
          parentNode.children.push(node);
        }
      }

      // 更新 parentId 为当前节点的 id，供下一层级使用
      parentId = id;
    }
  });

  // 遍历所有节点，将没有子节点的节点的 children 设置为 null
  nodesMap.forEach((node) => {
    if (node.children.length === 0) {
      node.children = null;
    }
  });

  return result;
}

// 示例输入
const input = ["aa.bb.cc", "bb.cc", "aa.cc"];
// 构建树形结构
const tree = buildTree(input);
// 输出结果（格式化后的 JSON）
console.log(JSON.stringify(tree, null, 2));

