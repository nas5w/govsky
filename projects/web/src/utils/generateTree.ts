import { flattenTree } from "react-accessible-treeview";
import { AllowedDomains, DomainHandles, TreeNode } from "../types";

function getParent(handle: string) {
  const handleParts = handle.split(".");
  handleParts.shift();
  return handleParts.join(".");
}

function recursivelyAddParents(
  map: Record<string, TreeNode>,
  parent: string,
  child: string,
  domainSet: Set<string>
) {
  if (!map[parent]) {
    map[parent] = {
      name: parent,
      children: [],
    };
    if (!domainSet.has("." + parent)) {
      recursivelyAddParents(map, getParent(parent), parent, domainSet);
    }
  }
  map[parent].children.push(map[child]);
}

export function generateTree(
  domainHandles: DomainHandles[],
  domains: AllowedDomains
) {
  const domainSet = new Set<string>(domains);

  const topLevel: TreeNode = { name: "", children: [] };

  for (const domainHandle of domainHandles) {
    const handleMap = domainHandle.data.reduce((acc, el) => {
      acc[el.handle] = {
        name: el.handle,
        children: [],
        metadata: { handle: el.handle, displayName: el.displayName },
      };

      const parent = getParent(el.handle);

      recursivelyAddParents(acc, parent, el.handle, domainSet);

      return acc;
    }, {} as Record<string, TreeNode>);

    // If a node has a handle and children _or_ is top-level, add separate child
    Object.values(handleMap).forEach((node) => {
      if (
        node.metadata?.handle &&
        (node.children.length ||
          node.metadata.handle.split(".").length ===
            domainHandle.domain.split(".").length)
      ) {
        node.children.push({
          name: " " + node.metadata.handle,
          children: [],
          metadata: {
            handle: node.metadata.handle,
            displayName: node.metadata.displayName,
          },
        });
      }
      node.children.sort((a, b) => (a.name > b.name ? 1 : -1));
    });

    const domainPart = domainHandle.domain.slice(1);
    if (handleMap[domainPart]) {
      topLevel.children.push(...handleMap[domainPart].children);
    }
  }

  return flattenTree(topLevel);
}
