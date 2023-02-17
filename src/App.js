import React, { useState } from "react";

import "./App.css";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [code, setCode] = useState(
    new URLSearchParams(window.location.search).get("code")
  );

  return (
    <div className="App">
      <header className="App-header">
        <div>{code ? <Dashboard code={code} /> : <Login />}</div>
      </header>
    </div>
  );
}

export default App;
