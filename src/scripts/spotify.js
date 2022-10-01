const authEndpoint = "https://accounts.spotify.com/authorize";
// const redirectUri = "http://localhost:3000";
const redirectUri = "https://rileyhgrant.github.io/spotify-album-art-player-client/";
export const CLIENT_ID = "47a6dc56f30f467090615ebd2371aa1f";

const scopes = ["streaming", "user-read-playback-state"];

export const loginUrl = `${authEndpoint}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;
