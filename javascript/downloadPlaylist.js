async function downloadPlaylist() {
  const playlist = getTrackIdsCookie();

  if (playlist.length === 0) {
    makeInvisible("loadingDownload");
    return;
  }

  console.log("[DOWNLOAD] This process usually takes a long time. Please be patient.");
  const progressMessage = document.getElementById("progressMessage");
  progressMessage.innerHTML = "Downloading tracks. This process usually takes a while, please be patient!";
  makeVisible("loadingDownload");

  var failedTrackIds = [];

  for (let i = 0; i < playlist.length; i++) {
    // Wait 1 second between each download. This is to prevent the API from blocking the request.
    await new Promise((r) => setTimeout(r, 1000));
    const response = await fetch(`https://api.vevioz.com/api/button/mp3/${playlist[i]}`);

    if (response.status === 429) {
      console.log("[DOWNLOAD] Too many requests. Waiting 30 seconds before making another request.");
      failedTrackIds.push(playlist[i]);
      await new Promise((r) => setTimeout(r, 30000));
      continue;
    }

    const responseString = await response.text();

    if (responseString === null) {
      console.log(`[DOWNLOAD] Failed to download track ${i} of ${playlist.length}.`);
      failedTrackIds.push(playlist[i]);
      continue;
    }

    const downloadLink = responseString.match(
      /https:\/\/cdn-\d+\.vevioz\.com\/download\/[a-zA-Z_\-0-9]{11}\/mp3\/192\/\d{10}\/[a-zA-Z0-9]{64}\/0/
    )[0];

    if (!downloadLink) {
      console.log(`[DOWNLOAD] Failed to download track ${i} of ${playlist.length}.`);
      failedTrackIds.push(playlist[i]);
      continue;
    }

    const file = document.createElement("a");
    file.href = downloadLink;
    file.click();
    console.log(`[DOWNLOAD] Downloaded track ${i + 1} of ${playlist.length}.`);
  }

  if (failedTrackIds.length > 0) {
    progressMessage.innerHTML = "Some tracks failed to download. Retrying failed downloads.";
    await downloadFailedPlaylist(failedTrackIds);
  }

  makeInvisible("loadingDownload");
  progressMessage.innerHTML = "Download complete! Enjoy your music!";
  console.log("[DOWNLOAD] Download complete!");
}
