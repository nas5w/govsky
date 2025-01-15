import TreeView, { flattenTree } from "react-accessible-treeview";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config, GovskyConfig } from "@govsky/config";

type AllowedDomains = GovskyConfig[keyof GovskyConfig]["domains"];

type DomainHandles = {
  domain: string;
  data: ApiUser[];
};

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

function generateTree(domainHandles: DomainHandles[], domains: AllowedDomains) {
  const domainSet = new Set<string>(domains);

  const topLevel: TreeNode = { name: "", children: [] };

  function getParent(handle: string) {
    const handleParts = handle.split(".");
    handleParts.shift();
    return handleParts.join(".");
  }

  for (const domainHandle of domainHandles) {
    const handleMap = domainHandle.data.reduce((acc, el) => {
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
        if (!domainSet.has("." + parent)) {
          recursivelyAddParents(map, getParent(parent), parent);
        }
      }
      map[parent].children.push(map[child]);
    }

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

function App() {
  const { country } = useParams<"country">();
  const [allHandles, setAllHandles] = useState<DomainHandles[]>();
  const [domains, setDomains] = useState<AllowedDomains>();
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!country || !(country in config)) {
        navigate("/us");
        return;
      }

      const { domains } = config[country as keyof GovskyConfig];

      setDomains(domains);

      const results = (
        await Promise.all(
          domains.map(async (domain) => {
            const res = await fetch(`https://govsky.fly.dev/api/${domain}`);
            const { data } = await res.json();
            return { domain, data: data as ApiUser[] };
          })
        )
      ).flat();

      setAllHandles(results);
    }
    load();
  }, [country, navigate]);

  const data = useMemo(() => {
    if (!allHandles || !domains) return undefined;

    const filteredHandles = [...allHandles];
    for (const key in filteredHandles) {
      filteredHandles[key].data = filteredHandles[key].data.filter(
        (el) =>
          (el.displayName || "").toLowerCase().includes(term.toLowerCase()) ||
          el.handle.toLowerCase().includes(term.toLowerCase())
      );
    }

    return generateTree(filteredHandles, domains);
  }, [term, allHandles, domains]);

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
