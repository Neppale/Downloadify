async function getPlaylistByUrlButton() {
  clearCurrentPlaylist();
  clearPlaylistCookie();

  var id = document.getElementById("playlist-url").value;
  if (!id) {
    return;
  }
  if (id === "Neppale" || id === "neppale" || id === "NEPPALE") {
    id = "4SZEPtcRPviOADs62ZhaLp";
    document.getElementById("playlist-url").value = id;
  }

  makeVisible("loadingSpotifySearch");
  const response = await getRemotePlaylistData(id);
  interpretResponse(response);
}
