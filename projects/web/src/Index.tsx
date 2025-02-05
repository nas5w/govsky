import "./App.css";
import * as gsc from "@govsky/config";
import CountryList from "./components/country-list";

const { config } = gsc;

const sortedConfig = Object.entries(config)
  .map(([code, { name }]) => ({ code, name }))
  .sort((a, b) => (a.name > b.name ? 1 : -1));

export const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-12 max-w-3xl mx-auto">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Discover Government on{" "}
            <span className="text-blueSkyBrand">Bluesky</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Welcome! Govsky is an effort to catalog government presence on
            Bluesky by tracking when official accounts verified with government
            domains sign up for the service.
          </p>
        </div>

        <div className="mt-12">
          <CountryList countries={sortedConfig} />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Not seeing an account? Contact us at{" "}
            <a
              href="mailto:@us.govsky.org"
              className="text-primary hover:underline"
            >
              @us.govsky.org
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
