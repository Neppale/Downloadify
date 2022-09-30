async function findAndSetDownloads(youtubeIds) {
  for (let i = 0; i < youtubeIds.length; i++) {
    if (youtubeIds[i] === "not-found") {
      console.log(`[DOWNLOAD] Track ${i + 1} not found.`);
      continue;
    }
    const response = await fetch(`https://api.vevioz.com/api/button/mp3/${youtubeIds[i]}`);
    const responseString = await response.text();
    if (responseString === null || response.status !== 200) return;

    const downloadLink = responseString.match(
      /https:\/\/cdn-\d+\.vevioz\.com\/download\/[a-zA-Z_\-0-9]{11}\/mp3\/192\/\d{10}\/[a-zA-Z0-9]{64}\/0/
    )[0];

    if (!downloadLink) return;

    const downloadButton = document.getElementById(`downloadButton${i}`);
    console.log(`[DOWNLOAD] Found link of YouTube ID: ${youtubeIds[i]}`);
    downloadButton.classList.remove("btn-download-unavailable");
    downloadButton.classList.add("btn-download");
    downloadButton.onclick = function () {
      window.location.href = downloadLink;
    };
  }
  console.log("[DOWNLOAD] All links found!");
}
