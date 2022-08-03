async function enrichPlaylistData(playlist) {
  const totalTracks = playlist.tracks.total;

  let enrichedTracks = playlist.tracks.items;
  let offset = 100;
  while (offset < totalTracks) {
    var response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?offset=${offset}&limit=100`,
      {
        headers: {
          Authorization: await getBearerToken(),
        },
      }
    );
    response = await response.json();
    enrichedTracks = enrichedTracks.concat(response.items);
    offset += 100;
  }
  playlist.tracks.items = enrichedTracks;
  return playlist;
}
