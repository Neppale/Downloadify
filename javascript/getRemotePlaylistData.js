async function getRemotePlaylistData(playlistId) {
  const headers = {
    Authorization: await getBearerToken(),
  };
  var response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers,
    }
  );
  if (response.status !== 200) {
    response = { error: { message: "Invalid playlist Id" } };
    return response;
  }
  const playlistData = await response.json();
  return playlistData;
}
