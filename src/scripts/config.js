const isProd = process.env.NODE_ENV === "production";

export const config = {
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  CLIENT_ID: "47a6dc56f30f467090615ebd2371aa1f",
  REDIRECT_URI: isProd
    ? "https://rileyhgrant.github.io/spotify-album-art-player-client/"
    : "http://localhost:3000",
  SERVER_URL: isProd
    // ? "https://server-album-art-web-player.herokuapp.com/login"
    ? "https://spotify-album-art-player-server.onrender.com/login"
    : "http://localhost:8000/login",
};
