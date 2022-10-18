async function showPlaylistToUser(playlist) {
  const playlistNameElement = document.getElementById("playlistName");
  playlistNameElement.innerText = playlist.name;

  const playlistInfoElement = document.getElementById("playlistInfo");
  playlistInfoElement.innerText = `by ${playlist.owner.display_name} - ${playlist.tracks.total} songs`;

  const playlistImageElement = document.getElementById("playlistImage");
  playlistImageElement.src = playlist.images[0].url;

  const playlistDiv = document.getElementById("playlistInfoAndTracks");
  playlistDiv.style.visibility = "visible";
  playlistDiv.style.display = "block";

  const playlistTracks = playlist.tracks.items.map((item) => item.track.name);
  const playlistArtists = playlist.tracks.items.map((item) => item.track.artists[0].name);

  var playlistTracksAndArtists = [];
  for (let i = 0; i < playlistTracks.length; i++) {
    const currentTrack = playlistTracks[i].replace(",", "").replace(";", "");
    const currentArtist = playlistArtists[i].replace(",", "").replace(";", "");
    playlistTracksAndArtists.push(`${currentArtist} - ${currentTrack}`);
  }

  setPlaylist(playlistTracksAndArtists.toString());

  const playlistTableElement = document.getElementById("playlistTable");

  while (playlistTableElement.rows.length > 1) {
    playlistTableElement.deleteRow(1);
  }

  for (let i = 0; i < playlistTracks.length; i++) {
    const currentTrack = playlistTracks[i].replace(",", "").replace(";", "");
    const currentArtist = playlistArtists[i].replace(",", "").replace(";", "");
    const row = playlistTableElement.insertRow(i + 1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell1.innerHTML = i + 1;
    cell2.innerHTML = currentTrack;
    cell3.innerHTML = currentArtist;
    cell4.innerHTML = `<button id="downloadButton${i}" class="btn btn-download-unavailable" disabled> Download </button>`;
  }
}
