import { Link } from "react-router-dom";
import gh from "./github-mark.png";

type Props = {
  countryName?: string;
};

export const Header = ({ countryName }: Props) => {
  return (
    <>
      {countryName && (
        <Link className="back-link" to="/">
          &laquo; Back to country list
        </Link>
      )}
      <header>
        <h1>Govsky</h1>
        {countryName && <span>{countryName}</span>}
        <div className="gh-link-container">
          <a className="gh-link" href="https://github.com/nas5w/govsky">
            <img src={gh} alt="GitHub logo"></img> Github
          </a>
        </div>
      </header>
    </>
  );
};
