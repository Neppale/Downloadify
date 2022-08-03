async function downloadFailedPlaylist(failedTrackIds) {
  console.log("[DOWNLOAD-RETRY] This process usually takes a long time. Please be patient.");

  // Wait 1.5 seconds before retrying failed downloads. This is to prevent the API from blocking the request.
  await new Promise((r) => setTimeout(r, 1500));
  var options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "2be4671a60mshd26219b033393e8p12eceajsn5bf47203341f",
      "X-RapidAPI-Host": "simple-youtube-search.p.rapidapi.com",
    },
  };

  var failedAttempts = 0;

  for (let i = 0; i < failedTrackIds.length; i++) {
    var response = await fetch(
      `https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${failedTrackIds[i]}&format=mp3&responseFormat=json`,
      options
    );

    if (response.status === 429) {
      console.log("[DOWNLOAD-RETRY] Too many requests. Switching headers.");
      options = await switchHeaders();
      response = await fetch(
        `https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${failedTrackIds[i]}&format=mp3&responseFormat=json`,
        options
      );
    }

    const responseJson = await response?.json();

    if (responseJson?.YoutubeAPI.urlMp3 === false) {
      console.log(`[DOWNLOAD-RETRY] Download link for ${failedTrackIds[i]} is not available`);
      failedAttempts++;
      continue;
    }

    const downloadLink = responseJson.YoutubeAPI.urlMp3;
    const file = document.createElement("a");
    file.href = downloadLink;
    file.click();
  }
}
