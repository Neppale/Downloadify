async function searchPlaylist() {
  const playlistTrackIds = getTrackIdsCookie();

  if (playlistTrackIds.length > 0) {
    console.log("[SEARCH] Playlist already searched.");
    await downloadPlaylist();
    return;
  }

  const playlist = getPlaylistCookie();
  if (playlist.length === 0) {
    makeInvisible("loadingDownload");
    return;
  }

  // Every song takes 1.5 seconds to search. For every 25 songs, we need to wait 30 seconds to prevent the API from blocking the request.
  const estimatedTime = Math.ceil(playlist.length / 25) * 30 * 2;
  const estimatedTimeMinutes = Math.floor(estimatedTime / 60);

  makeVisible("loadingDownload");
  const progressMessage = document.getElementById("progressMessage");
  progressMessage.innerHTML = `Gathering track data. This process usually takes a long time, please be patient. Estimated time: ${estimatedTimeMinutes} minutes.`;
  console.log(
    "[SEARCH] This process usually takes a long time, please be patient."
  );

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
      await new Promise((r) => setTimeout(r, 1000));
    }

    const response = await fetch(
      `https://simple-youtube-search.p.rapidapi.com/search?query=${currentTrack}&type=video&safesearch=false`,
      options
    );
    if (response.status === 429) {
      console.log("[SEARCH] Too many requests. Switching headers.");
      options = switchHeaders();
    }
    const responseJson = await response.json();
    const videoId = responseJson.results[0]?.id;

    // Don't push the videoId if it's already in the array.
    if (!youtubeIds.includes(videoId)) {
      youtubeIds.push(videoId);
      console.log(
        `[SEARCH] Found ${currentTrack.replace(" audio", "")} (${videoId})`
      );
    }
  }
  setTrackIdsCookie(youtubeIds);
  console.log("[SEARCH] Search complete!");
  await downloadPlaylist();
}
