import { Link } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import * as gsc from "@govsky/config";

const { config } = gsc;

const sortedConfig = Object.entries(config)
  .map(([code, { name }]) => ({ code, name }))
  .sort((a, b) => (a.name > b.name ? 1 : -1));

export const Index = () => {
  return (
    <main>
      <Header />
      <p className="description">
        Welcome! Govsky is an effort to catalog government presence on Bluesky
        by tracking when officially government domains sign up for the service.
      </p>
      <p className="description">
        Find your country below to see which government entities are on Bluesky.
      </p>
      <ul className="country-list">
        {sortedConfig.map(({ code, name }) => (
          <li key={code}>
            <Link to={`/${code}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};
