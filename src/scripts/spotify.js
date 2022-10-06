import { config } from "./config";

const scopes = ["streaming", "user-read-playback-state"];

export const loginUrl = `${config.AUTH_ENDPOINT}?client_id=${
  config.CLIENT_ID
}&response_type=code&redirect_uri=${config.REDIRECT_URI}&scope=${scopes.join(
  "%20"
)}`;
