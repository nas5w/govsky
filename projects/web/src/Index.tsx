import "./App.css";
import * as gsc from "@govsky/config";
import { Button } from "./components/ui/button"
import { Github } from "./components/icons/github"
import CountryList from "./components/country-list";

const { config } = gsc;

const sortedConfig = Object.entries(config)
  .map(([code, { name }]) => ({ code, name }))
  .sort((a, b) => (a.name > b.name ? 1 : -1));

export const Index = () => {
  return (
    <main>
      <div className="min-h-screen bg-background">
        <header className="border-b flex justify-center items-center">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Govsky</h1>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/nas5w/govsky">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </header>

        <main className="container px-4 py-12 max-w-3xl mx-auto">
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Discover Government on <span className="text-blueSkyBrand">Bluesky</span></h2>
            <p className="text-muted-foreground text-lg">
              Welcome! Govsky is an effort to catalog government presence on Bluesky by tracking when officially government domains sign up for the service.
            </p>
          </div>

          <div className="mt-12">
            <CountryList countries={sortedConfig}/> 
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Not seeing an account? Contact us at{" "}
              <a href="mailto:@us.govsky.org" className="text-primary hover:underline">
                @us.govsky.org
              </a>
            </p>
          </div>
        </main>
      </div>
    </main>
  );
};
