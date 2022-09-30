function getPlaylistCookie() {
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  let playlistTracks = [];
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const cookieValue = cookie.split("=")[1];
    playlistTracks = playlistTracks.concat(cookieValue.split(","));
  }

  return playlistTracks;
}
