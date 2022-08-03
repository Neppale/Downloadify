function getPlaylistCookie() {
  // There can be multiple cookies with the name PlaylistTrackList(id), so we need to get them all.

  const cookies = document.cookie.split(";");
  let playlistTracks = [];
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const cookieValue = cookie.split("=")[1];
    playlistTracks = playlistTracks.concat(cookieValue.split(","));
  }

  return playlistTracks;
}
