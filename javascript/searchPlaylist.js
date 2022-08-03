async function searchPlaylist() {
  const playlistTrackIds = getTrackIdsCookie();
  const playlist = getPlaylistCookie();

  if (playlistTrackIds.length > 0) {
    console.log("[SEARCH] Playlist already searched.");
    await downloadPlaylist();
    return;
  }

  if (playlist.length === 0) {
    makeInvisible("loadingDownload");
    return;
  }

  var estimatedTimeMinutes = Math.ceil((Math.ceil(playlist.length / 25) * 30 * 2) / 60);

  if (playlist.length < 10) estimatedTimeMinutes = 1;

  makeVisible("loadingDownload");
  const progressMessage = document.getElementById("progressMessage");
  progressMessage.innerHTML = `Gathering track data. This process usually takes a long time, please be patient. Estimated time: ${estimatedTimeMinutes} ${
    estimatedTimeMinutes === 1 ? "minute" : "minutes"
  }.`;
  console.log("[SEARCH] This process usually takes a long time, please be patient.");

  var options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "2be4671a60mshd26219b033393e8p12eceajsn5bf47203341f",
      "X-RapidAPI-Host": "simple-youtube-search.p.rapidapi.com",
    },
  };

  var youtubeIds = [];

  for (let i = 0; i < playlist.length; i++) {
    var currentTrack = playlist[i] + " audio";
    // After 25 requests, wait 30 seconds before making another request. This is to prevent the API from blocking the request.
    if (i % 25 === 0 && i !== 0) {
      await new Promise((r) => setTimeout(r, 30000));
    } else {
      await new Promise((r) => setTimeout(r, 500));
    }

    var response = await fetch(
      `https://simple-youtube-search.p.rapidapi.com/search?query=${currentTrack}&type=video&safesearch=false`,
      options
    );

    if (response.status === 429) {
      console.warn("[SEARCH] Too many requests. Switching headers.");
      options = await switchHeaders();
      await new Promise((r) => setTimeout(r, 5000));
      response = await fetch(
        `https://simple-youtube-search.p.rapidapi.com/search?query=${currentTrack}&type=video&safesearch=false`,
        options
      );
    }

    const responseJson = await response.json();
    const videoId = findCorrectVideoId(responseJson, currentTrack);
    if (videoId) {
      youtubeIds.push(videoId);
      console.log(`[SEARCH] Found track ${i + 1} of ${playlist.length} tracks.`);
    } else console.log(`[SEARCH] Track ${i + 1} not found.`);
  }
  setTrackIdsCookie(youtubeIds);
  console.log("[SEARCH] Search complete!");
  await downloadPlaylist();
}
