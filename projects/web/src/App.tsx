import TreeView, { flattenTree } from "react-accessible-treeview";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import * as govskyConfig from "@govsky/config";
import { GovskyConfig } from "@govsky/config";

const { config } = govskyConfig;

type ApiUser = {
  handle: string;
  did: string;
  displayName: string | null;
};

// Assemble tree
type TreeNode = {
  name: string;
  children: TreeNode[];
  metadata?: { handle?: string; displayName: string | null };
};

function generateTree(handles: ApiUser[]) {
  function getParent(handle: string) {
    const handleParts = handle.split(".");
    handleParts.shift();
    return handleParts.join(".");
  }

  const handleMap = handles.reduce((acc, el) => {
    // Make sure parent node exists if it doesn't already

    acc[el.handle] = {
      name: el.handle,
      children: [],
      metadata: { handle: el.handle, displayName: el.displayName },
    };

    const parent = getParent(el.handle);

    recursivelyAddParents(acc, parent, el.handle);

    return acc;
  }, {} as Record<string, TreeNode>);

  function recursivelyAddParents(
    map: typeof handleMap,
    parent: string,
    child: string
  ) {
    if (!map[parent]) {
      map[parent] = {
        name: parent,
        children: [],
      };
      if (parent !== "gov") {
        recursivelyAddParents(map, getParent(parent), parent);
      }
    }
    map[parent].children.push(map[child]);
  }

  // If a node has a handle and children _or_ is top-level, add separate child
  Object.values(handleMap).forEach((node) => {
    if (
      node.metadata?.handle &&
      (node.children.length || node.metadata.handle.split(".").length === 2)
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

  if (!handleMap.gov) {
    return [];
  }

  return flattenTree(handleMap.gov);
}

function App() {
  const { country } = useParams<"country">();
  const [allHandles, setAllHandles] = useState<ApiUser[]>();
  const [, setDomains] =
    useState<GovskyConfig[keyof GovskyConfig]["domains"]>();
  const [term, setTerm] = useState("");

  useEffect(() => {
    async function load() {
      if (!country || !(country in config)) {
        setAllHandles([]);
        return;
      }

      const { domains } = config[country as keyof GovskyConfig];

      setDomains(domains);

      const results = (
        await Promise.all(
          domains.map(async (domain) => {
            const res = await fetch(`https://govsky.fly.dev/api/${domain}`);
            const { data } = await res.json();
            return data as ApiUser[];
          })
        )
      ).flat();

      setAllHandles(results);
    }
    load();
  }, [country]);

  const data = useMemo(() => {
    if (!allHandles) return undefined;
    const filteredHandles = allHandles.filter(
      (el) =>
        (el.displayName || "").toLowerCase().includes(term.toLowerCase()) ||
        el.handle.toLowerCase().includes(term.toLowerCase())
    );

    return generateTree(filteredHandles);
  }, [term, allHandles]);

  return (
    <main>
      <header>
        <h1>GovSky</h1>
        <span>United States</span>
      </header>
      <p className="description">
        Discover official U.S. government accounts on Bluesky.
        <br />
        Not seeing an account? Contact me{" "}
        <a href="https://bsky.app/profile/govsky.bsky.social" target="_blank">
          @govsky.bsky.social
        </a>
        .
      </p>

      <div className="search">
        <label htmlFor="govsky-search">Search</label>
        <input
          id="govsky-search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
          }}
          placeholder="City of Boston"
        ></input>
      </div>

      {!data ? (
        <p className="no-results">Loading...</p>
      ) : !data.length ? (
        <p className="no-results">No results.</p>
      ) : (
        <TreeView
          key={term}
          data={data}
          expandedIds={term.trim() ? data.map(({ id }) => id) : undefined}
          className="basic"
          aria-label="Bluesky US government accounts"
          nodeRenderer={({ element, getNodeProps, level, isExpanded }) => {
            const nodeProps = getNodeProps();

            if (!element.children.length) {
              return (
                <div {...nodeProps} style={{ paddingLeft: 20 * (level - 1) }}>
                  <span className="indicator"></span>
                  <a
                    href={`https://bsky.app/profile/${element.metadata?.handle}`}
                    target="_blank"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.click();
                      }
                    }}
                  >
                    @{element.name.trim()}
                  </a>
                  {element.metadata?.displayName ? (
                    <span className="display-name">
                      {element.metadata.displayName}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              );
            }

            return (
              <div {...nodeProps} style={{ paddingLeft: 20 * (level - 1) }}>
                <span className="indicator">{isExpanded ? "-" : "+"}</span>@
                {element.name} ({element.children.length})
              </div>
            );
          }}
        />
      )}
    </main>
  );
}

export default App;
