import { GovskyConfig } from "@govsky/config";
import { ApiUser } from "@govsky/api/types";

export type AllowedDomains = GovskyConfig[keyof GovskyConfig]["domains"];

export type DomainHandles = {
  domain: string;
  data: ApiUser[];
};

// Assemble tree
export type TreeNode = {
  name: string;
  children: TreeNode[];
  metadata?: {
    handle?: string;
    displayName: string | null;
    childCount?: number;
  };
};
