const scopes = [
  "user-library-read",
  "user-library-modify",
  "user-read-playback-position",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  //Playlist
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "ugc-image-upload",
  //User
  "user-read-private",
  "user-top-read",
  "user-follow-read",
  "user-follow-modify",
].join(" ");

export { scopes };


