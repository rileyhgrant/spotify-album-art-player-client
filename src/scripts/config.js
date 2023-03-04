const isProd = process.env.NODE_ENV === "production";

export const config = {
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  CLIENT_ID: "cef624f457c34714ae06c44372304f51",
  REDIRECT_URI: isProd
    ? "https://rileyhgrant.github.io/spotify-album-art-player-client/"
    : "http://localhost:3000",
  SERVER_URL: isProd
    ? "https://spotify-album-art-player-server.onrender.com/login"
    : "http://localhost:8000/login",
};
