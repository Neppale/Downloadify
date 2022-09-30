async function findAndSetDownloads(youtubeIds) {
  for (let i = 0; i < youtubeIds.length; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const response = await fetch(`https://api.vevioz.com/api/button/mp3/${youtubeIds[i]}`);

    if (response.status === 429) {
      console.log("[DOWNLOAD] Too many requests. Waiting 30 seconds before making another request.");
      failedTrackIds.push(youtubeIds[i]);
      await new Promise((r) => setTimeout(r, 30000));
      continue;
    }

    const responseString = await response.text();

    if (responseString === null) return;

    const downloadLink = responseString.match(
      /https:\/\/cdn-\d+\.vevioz\.com\/download\/[a-zA-Z_\-0-9]{11}\/mp3\/192\/\d{10}\/[a-zA-Z0-9]{64}\/0/
    )[0];

    if (!downloadLink) return;

    const downloadButton = document.getElementById(`downloadButton${i}`);
    console.log(`[FOUND] Found link of YouTube ID: ${youtubeIds[i]}`);
    downloadButton.classList.remove("btn-download-unavailable");
    downloadButton.classList.add("btn-download");
    downloadButton.onclick = function () {
      window.location.href = downloadLink;
    };
  }
  console.log("[FOUND] All links found!");
}
