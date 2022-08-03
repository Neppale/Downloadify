async function interpretResponse(response) {
  const spotifyResponse = document.getElementById("spotifyResponse");
  const errorMessage = response.error?.message;

  // Spotify sends a "Not found." error message if the playlist is private, and a "Invalid playlist Id" error message when the playlist is really not found.

  if (errorMessage === "Not found.") {
    spotifyResponse.innerText =
      "This playlist is private. You need to login with Spotify to use it.";
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

  if (response.tracks.total > 100)
    response = await enrichPlaylistData(response);

  if (response.tracks.total > 150) {
    spotifyResponse.innerText =
      "This playlist is too big! The maximum playlist size is 150 songs.";

    makeInvisible("loadingSpotifySearch");
    return;
  }

  makeInvisible("loadingSpotifySearch");
  showPlaylistToUser(response);
}
