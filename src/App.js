// import logo from "./logo.svg";

// import * as dotenv from 'dotenv'

import "./App.css";

import React, { useState } from "react";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard"

// dotenv.config()


// 
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
