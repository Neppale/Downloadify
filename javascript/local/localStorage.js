function getPlaylist() {
  const playlistTracks = localStorage.getItem("playlistTrackList");
  return playlistTracks ? playlistTracks.split(",") : [];
}

function setPlaylist(playlistTracksAndArtists) {
  localStorage.setItem("playlistTrackList", playlistTracksAndArtists);
}

function getTrackIds() {
  const trackIds = localStorage.getItem("playlistTrackIds");
  return trackIds ? trackIds.split(",") : [];
}

function setTrackIds(trackIds) {
  localStorage.setItem("playlistTrackIds", trackIds);
}

function clearLocalStorage() {
  localStorage.clear();
}
