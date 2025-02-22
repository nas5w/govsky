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

  const relationshipExists = map[parent].children.find(
    (el) => el.name === map[child].name
  );

  if (!relationshipExists) {
    map[parent].children.push(map[child]);
  }
}

export function generateTree(
  domainHandles: DomainHandles[],
  domains: AllowedDomains
) {
  const domainSet = new Set<string>(domains);

  const topLevel: TreeNode = { name: "", children: [] };

  for (const domainHandle of domainHandles) {
    const handleMap = domainHandle.data.reduce((acc, el) => {
      if (!acc[el.handle]) {
        acc[el.handle] = {
          name: el.handle,
          children: [],
        };
      }

      acc[el.handle].metadata = {
        handle: el.handle,
        displayName: el.displayName,
      };

      const isTopLevel = domainSet.has(`.${el.handle}`);
      if (!isTopLevel) {
        const parent = getParent(el.handle);
        recursivelyAddParents(acc, parent, el.handle, domainSet);
      }

      return acc;
    }, {} as Record<string, TreeNode>);

    // If a node has a handle and children _or_ is top-level, add separate child
    Object.values(handleMap).forEach((node) => {
      const isTopLevel =
        !!node.metadata?.handle && domainSet.has(`.${node.metadata.handle}`);
      if (
        node.metadata?.handle &&
        (node.children.length ||
          node.metadata.handle.split(".").length ===
            domainHandle.domain.split(".").length ||
          isTopLevel)
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

  getChildCount(topLevel);

  return flattenTree(topLevel);
}

function getChildCount(node: TreeNode) {
  if (node.metadata?.childCount) {
    return node.metadata.childCount;
  }

  const childCount: number = node.children.reduce((acc, child) => {
    return acc + Math.max(getChildCount(child), 1);
  }, 0);

  if (!node.metadata) node.metadata = { displayName: null };
  node.metadata.childCount = childCount;

  return childCount;
}
