import React from "react";
import "../../App.css";
import { loginUrl } from "../../scripts/spotify";

const Login = () => {
  return (
    <h2>
      <a
        className="App-link"
        href={loginUrl}
        // TODO:(rgrant) maybe put back?
        // target="_blank"
        // rel="noopener noreferrer"
      >
        Sign into Spotify to Use
      </a>
    </h2>
  );
};

export default Login;
