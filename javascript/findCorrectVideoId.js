function findCorrectVideoId(responseJson, currentTrack) {
  currentTrack = currentTrack.split(" - ")[1].split("(")[0].trim().toLowerCase().replace(" audio", "");
  if (responseJson.results === undefined || responseJson.results?.length === 0) {
    console.warn(`[SEARCH] Track not found: ${currentTrack}`);
    return;
  }

  for (let i = 0; i < responseJson.results.length; i++) {
    const videoTitle = responseJson.results[i].title.toLowerCase();
    const trackTitle = currentTrack.toLowerCase();

    if (videoTitle.includes(trackTitle)) {
      return responseJson.results[i].id;
    }

    if (!videoTitle.includes(trackTitle)) {
      for (let j = 1; j < responseJson.results.length; j++) {
        const resultTitle = responseJson.results[j].title.toLowerCase();

        if (resultTitle.includes(trackTitle)) {
          videoId = responseJson.results[j].id;
          return videoId;
        }

        if (j === responseJson.results.length - 1) {
          return;
        }
      }
    }
  }
}
