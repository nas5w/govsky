import TreeView from "react-accessible-treeview";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as gsc from "@govsky/config";
import { GovskyConfig } from "@govsky/config";
import { ApiUser } from "@govsky/api/types";
import { AllowedDomains, DomainHandles } from "./types";
import { generateTree } from "./utils/generateTree";
import { Header } from "./components/Header";

const { config } = gsc;

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

  const countryName = country
    ? config[country as keyof GovskyConfig].name
    : undefined;

  useEffect(() => {
    if (countryName) {
      document.title = `${countryName} | Govsky`;
    } else {
      document.title = "Govsky";
    }
  }, [countryName]);

  return (
    <main>
      <Header countryName={countryName} />
      <p className="description">
        Discover official government accounts on Bluesky.
        <br />
        Not seeing an account? Contact me{" "}
        <a href="https://bsky.app/profile/us.govsky.org" target="_blank">
          @us.govsky.org
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
