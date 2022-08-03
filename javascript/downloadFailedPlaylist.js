async function downloadFailedPlaylist(failedTrackIds) {
  console.log(
    "[DOWNLOAD-RETRY] This process usually takes a long time. Please be patient."
  );
  const progressMessage = document.getElementById("progressMessage");
  // Wait 5 seconds before retrying failed downloads. This is to prevent the API from blocking the request.
  await new Promise((r) => setTimeout(r, 5000));
  for (let i = 0; i < failedTrackIds.length; i++) {
    const response = await fetch(
      `https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${failedTrackIds[i]}&format=mp3&responseFormat=json`,
      options
    );
    const responseJson = await response.json();
    if (response.status === 429) {
      console.log("[SEARCH] Too many requests. Please try again later.");
      progressMessage.innerHTML =
        "Oops! Something went wrong. Please try again later.";
      switchVisiblity("loadingDownload");
      break;
    }
    if (responseJson.YoutubeAPI.urlMp3 === false) {
      console.log(
        `[DOWNLOAD-RETRY] Download link for ${failedTrackIds[i]} is not available`
      );
    }
    const downloadLink = responseJson.YoutubeAPI.urlMp3;
    window.open(downloadLink);
  }
}
