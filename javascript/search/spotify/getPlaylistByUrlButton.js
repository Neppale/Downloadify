async function getPlaylistByUrlButton() {
  clearCurrentPlaylist();
  clearPlaylistCookie();

  document.getElementById("spotifyResponse").innerHTML = "";

  var id = document.getElementById("playlist-url").value;
  if (!id) {
    return;
  }

  if (id === "Neppale" || id === "neppale" || id === "NEPPALE") {
    id = "4SZEPtcRPviOADs62ZhaLp";
    document.getElementById("playlist-url").value = id;
  }

  // If id matches the pattern of a spotify playlist url, extract only the id.
  var match = id.match(/spotify:playlist:([a-zA-Z0-9]+)/);
  if (match) {
    id = match[1];
    document.getElementById("playlist-url").value = id;
  }

  match = id.match(/open.spotify.com\/playlist\/([a-zA-Z0-9]+)/);
  if (match) {
    id = match[1];
    document.getElementById("playlist-url").value = id;
  }

  makeVisible("loadingSpotifySearch");
  const response = await getRemotePlaylistData(id);
  interpretResponse(response);
}
