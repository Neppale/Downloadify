async function downloadPlaylist() {
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

  var failedTrackIds = [];

  for (let i = 0; i < playlist.length; i++) {
    // Wait 2 seconds between each download. This is to prevent the API from blocking the request.
    await new Promise((r) => setTimeout(r, 2000));
    const response = await fetch(
      `https://api.vevioz.com/api/button/mp3/${playlist[i]}`
    );

    if (response.status !== 200) {
      console.log("[DOWNLOAD] Too many requests. Please try again later.");
      progressMessage.innerHTML =
        "Oops! Something went wrong. Please try again later.";
      makeInvisible("loadingDownload");
      break;
    }

    const responseString = await response.text();

    if (responseString.includes("This download token is invalid.")) {
      console.log(
        `[DOWNLOAD] Download link for ${playlist[i]} is not available`
      );
      failedTrackIds.push(playlist[i]);
    }

    // Get the download link from the response according to the following structure as regex: https://cdn-NUMBER.vevioz.com/download/RANDOM-STRING-OF-11-CHARACTERS/mp3/192/10-NUMBERS/64-ALPHANUMERIC-CHARACTERS/0

    const downloadLink = responseString.match(
      /https:\/\/cdn-\d+\.vevioz\.com\/download\/[a-zA-Z_\-0-9]{11}\/mp3\/192\/\d{10}\/[a-zA-Z0-9]{64}\/0/
    )[0];

    // Download the file.
    const a = document.createElement("a");
    a.href = downloadLink;
    a.click();
  }

  if (failedTrackIds.length > 0) {
    await downloadFailedPlaylist(failedTrackIds);
    return;
  }
  makeInvisible("loadingDownload");
  progressMessage.innerHTML = "Download complete! Enjoy your music!";
  console.log("[DOWNLOAD] Download complete!");
}
