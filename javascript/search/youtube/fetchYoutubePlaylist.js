async function fetchYoutubePlaylist() {
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
  const estimatedPauseTime = Math.floor(playlist.length / 25) * 30;
  const estimatedTimeSeconds = 3 * playlist.length + estimatedPauseTime;
  const estimatedTimeMinutes = Math.floor(estimatedTimeSeconds / 60);
  const estimatedTimeString = estimatedTimeMinutes + "min" + (estimatedTimeSeconds % 60).toFixed(0) + "s";

  if (playlist.length < 10) estimatedTimeMinutes = 1;

  makeVisible("loadingDownload");
  const progressMessage = document.getElementById("progressMessage");
  progressMessage.innerHTML = `Gathering track data. This process usually takes a long time, please be patient. Estimated time: ${estimatedTimeString}`;
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
    if (i % 25 === 0 && i !== 0) {
      await new Promise((r) => setTimeout(r, 30000));
    } else {
      await new Promise((r) => setTimeout(r, 500));
    }

    var youtubeResponse = await fetch(
      `https://simple-youtube-search.p.rapidapi.com/search?query=${currentTrack}&type=video&safesearch=false`,
      options
    );

    if (youtubeResponse.status === 429) {
      console.warn("[SEARCH] Too many requests. Switching headers.");
      options = await switchHeaders();
      await new Promise((r) => setTimeout(r, 5000));
      youtubeResponse = await fetch(
        `https://simple-youtube-search.p.rapidapi.com/search?query=${currentTrack}&type=video&safesearch=false`,
        options
      );
    }

    const youtubeResponseJson = await youtubeResponse.json();
    const videoId = findCorrectVideoId(youtubeResponseJson, currentTrack);
    if (videoId) {
      const downloaderResponse = await fetch(`https://api.vevioz.com/api/button/mp3/${videoId}`);
      const downloaderResponseString = await downloaderResponse.text();
      if (downloaderResponseString === null || downloaderResponse.status !== 200) continue;

      const downloadLink = downloaderResponseString.match(
        /https:\/\/cdn-\d+\.vevioz\.com\/download\/[a-zA-Z_\-0-9]{11}\/mp3\/192\/\d{10}\/[a-zA-Z0-9]{64}\/0/
      )[0];

      if (!downloadLink) return;

      const downloadButton = document.getElementById(`downloadButton${i}`);
      console.log(`[DOWNLOAD] Found the song: ${playlist[i]}`);
      downloadButton.removeAttribute("disabled");
      downloadButton.classList.add("btn-download");
      downloadButton.onclick = function () {
        window.location.href = downloadLink;
      };
    }
  }
  console.log("[SEARCH] Search complete!");
  progressMessage.innerHTML = "Search complete! You can now download the playlist.";
  makeInvisible("loadingDownload");
}
