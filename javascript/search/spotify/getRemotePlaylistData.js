async function getRemotePlaylistData(playlistId) {
  const headers = {
    Authorization: await getBearerToken(),
  };
  var response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers,
  });
  const playlistData = await response.json();
  return playlistData;
}
