import TreeView from "react-accessible-treeview";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as gsc from "@govsky/config";
import { GovskyConfig } from "@govsky/config";
import { ApiUser } from "@govsky/api/types";
import { AllowedDomains, DomainHandles } from "./types";
import { generateTree } from "./utils/generateTree";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "./components/ui/input";
import { ChevronRight, ExternalLink } from "lucide-react";

const { config } = gsc;

function App() {
  const { country } = useParams<"country">();
  const [allHandles, setAllHandles] = useState<DomainHandles[]>();
  const [domains, setDomains] = useState<AllowedDomains>();
  const [error, setError] = useState(false);
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

      try {
        const results = (
          await Promise.all(
            domains.map(async (domain) => {
              const res = await fetch(`https://govsky.fly.dev/api/${domain}`);
              const { data } = await res.json();
              return { domain, data: (data || []) as ApiUser[] };
            })
          )
        ).flat();
        setAllHandles(results);
      } catch {
        setError(true);
      }
    }
    load();
  }, [country, navigate]);

  const data = useMemo(() => {
    if (!allHandles || !domains) return undefined;

    const filteredHandles = allHandles.map((handle) => ({
      ...handle,
      data: [...handle.data],
    }));
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
    return () => {
      document.title = "Govsky";
    };
  }, [countryName]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-6">
              <Button variant="ghost" size="sm" asChild className="pl-0">
                <Link to="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to countries
                </Link>
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {countryName}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Discover official government accounts on Bluesky
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              id="govsky-search"
              type="search"
              placeholder="Search accounts..."
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
              }}
              className="mb-4"
            />

            {!data ? (
              <p className="no-results">
                {error
                  ? "There was an error loading this page. Please try again. If the problem persists, report an issue on GitHub."
                  : "Loading..."}
              </p>
            ) : data.length <= 1 ? (
              <p className="text-center text-muted-foreground">
                No accounts found.
              </p>
            ) : (
              <TreeView
                key={term}
                data={data}
                expandedIds={term.trim() ? data.map(({ id }) => id) : undefined}
                expandOnKeyboardSelect
                aria-label="Bluesky US government accounts"
                nodeRenderer={({
                  element,
                  getNodeProps,
                  level,
                  isExpanded,
                }) => {
                  const hasChildren = element.children.length > 0;
                  const displayName = element.metadata?.displayName;
                  const showDisplayName = !hasChildren && displayName;

                  return (
                    <div {...getNodeProps()}>
                      <button
                        className="w-full rounded-lg border bg-card text-card-foreground p-4 transition-colors hover:bg-accent/50 mt-2"
                        style={{
                          marginLeft: `${20 * (level - 1)}px`,
                          cursor: hasChildren ? "pointer" : "default",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {hasChildren ? (
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            ) : null}

                            <div className="text-left">
                              {showDisplayName ? (
                                <div className="font-medium truncate">
                                  {displayName}
                                </div>
                              ) : null}
                              <div
                                className={`font-medium ${
                                  showDisplayName
                                    ? "text-muted-foreground truncate"
                                    : ""
                                }`}
                              >
                                @{element.name.trim()}
                              </div>
                            </div>
                          </div>

                          {hasChildren ? (
                            <div className="text-sm text-muted-foreground">
                              {element.children.length} accounts
                            </div>
                          ) : (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="ml-4 text-blueSkyBrand"
                            >
                              <a
                                href={`https://bsky.app/profile/${element.metadata?.handle}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Bluesky
                              </a>
                            </Button>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
