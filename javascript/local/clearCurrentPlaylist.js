function clearCurrentPlaylist() {
  const playlistNameElement = document.getElementById("playlistName");
  const playlistInfoElement = document.getElementById("playlistInfo");
  const playlistImageElement = document.getElementById("playlistImage");
  const playlistDiv = document.getElementById("playlistInfoAndTracks");
  playlistDiv.style.visibility = "hidden";
  playlistDiv.style.display = "none";

  playlistNameElement.innerText = "";
  playlistImageElement.src = "";
  playlistInfoElement.innerText = "";
}
