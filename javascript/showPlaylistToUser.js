function showPlaylistToUser(playlist) {
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

  setPlaylistCookie(playlistTracksAndArtists.toString());
}
