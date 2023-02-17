import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../scripts/config";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    console.log("running useAuth useEffect with code:", code);
    axios
      // .post("http://localhost:8000/login", {
      .post(config.SERVER_URL, {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        window.history.pushState({}, null, "/spotify-album-art-player-client/");
      })
      .catch((err) => {
        console.log("caught error in this branch!");
        console.log(err);
        // TODO:(rgrant) have some hook that if this fails, set a message back to app
        // window.location = '/'
      });
  }, [code]);

  return accessToken;
}
