// This file is a collection of functions that are used in the Spotify search. It is organized by user action flow.

async function getPlaylistByUrlButton() {
  clearCurrentPlaylist();
  clearLocalStorage();

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

async function getBearerToken() {
  const header = {
    Authorization: "Basic MTAxYjYzNzdjZTFkNDllOTg1YzQzMDE0NmFmMTE2ZjU6Mjk0YzI3YTE2ZWRhNGIyYjlkOWU3ZTIyMmU1ODFkMTI",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: header,
    body: "grant_type=client_credentials",
  }).then((response) => response.json());

  return `Bearer ${response.access_token}`;
}

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

async function interpretResponse(response) {
  const spotifyResponse = document.getElementById("spotifyResponse");
  const errorMessage = response.error?.message;

  if (errorMessage === "Not found.") {
    spotifyResponse.innerText = "This playlist is private. You need to login with Spotify to use it.";
    makeInvisible("loadingSpotifySearch");
    return;
  }

  if (errorMessage === "Invalid playlist Id") {
    spotifyResponse.innerText = "This playlist was not found.";
    makeInvisible("loadingSpotifySearch");
    return;
  }

  if (response.tracks.total === 0) {
    spotifyResponse.innerText = "This playlist is empty.";
    makeInvisible("loadingSpotifySearch");
    return;
  }

  const enrichedPlaylist = await enrichPlaylistData(response);

  // if (response.tracks.total > 150) {
  //   spotifyResponse.innerText = "This playlist is too big! The maximum playlist size is 150 songs.";

  //   makeInvisible("loadingSpotifySearch");
  //   return;
  // }

  makeInvisible("loadingSpotifySearch");
  showPlaylistToUser(enrichedPlaylist);
}
