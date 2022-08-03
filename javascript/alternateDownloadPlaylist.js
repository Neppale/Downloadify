async function alternateDownloadPlaylist() {
  const playlist = getTrackIdsCookie();
  if (playlist.length === 0) {
    makeInvisible("loadingDownload");
    return;
  }

  console.log(
    "[DOWNLOAD] This process usually takes a long time. Please be patient."
  );
  const progressMessage = document.getElementById("progressMessage");
  progressMessage.innerHTML =
    "Downloading tracks. This process usually takes a while, please be patient!";
  makeVisible("loadingDownload");

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "2be4671a60mshd26219b033393e8p12eceajsn5bf47203341f",
      "X-RapidAPI-Host": "t-one-youtube-converter.p.rapidapi.com",
    },
  };

  failedTrackIds = [];
  for (let i = 0; i < playlist.length; i++) {
    // Wait 2 seconds between each download. This is to prevent the API from blocking the request.

    await new Promise((r) => setTimeout(r, 2000));
    const response = await fetch(
      `https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${playlist[i]}&format=mp3&responseFormat=json`,
      options
    );
    const responseJson = await response.json();
    if (response.status === 429) {
      console.log("[DOWNLOAD] Too many requests. Please try again later.");
      progressMessage.innerHTML =
        "Oops! Something went wrong. Please try again later.";
      makeInvisible("loadingDownload");
      break;
    }
    if (responseJson.YoutubeAPI.urlMp3 === false) {
      console.log(
        `[DOWNLOAD] Download link for ${playlist[i]} is not available`
      );
      failedTrackIds.push(playlist[i]);
    }
    const downloadLink = responseJson.YoutubeAPI.urlMp3;
    window.open(downloadLink);
  }

  if (failedTrackIds.length > 0) {
    await downloadFailedPlaylist(failedTrackIds);
    return;
  }

  makeInvisible("loadingDownload");
  progressMessage.innerHTML = "Download complete! Enjoy your music!";
  console.log("[DOWNLOAD] Download complete!");
}
