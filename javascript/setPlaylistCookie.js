function setPlaylistCookie(playlistTracksAndArtists) {
  // For every 140 tracks, we need to create a new cookie, because the maximum size of a cookie is 4096 bytes.

  const tracksAndArtists = playlistTracksAndArtists.split(",");
  const numberOfCookies = Math.ceil(tracksAndArtists.length / 140);
  const tracksAndArtistsPerCookie = Math.ceil(
    tracksAndArtists.length / numberOfCookies
  );

  for (let i = 0; i < numberOfCookies; i++) {
    const cookieName = `playlistTrackList${i}`;
    const cookieValue = tracksAndArtists
      .slice(i * tracksAndArtistsPerCookie, (i + 1) * tracksAndArtistsPerCookie)
      .join(",");
    document.cookie = `${cookieName}=${cookieValue};path=/`;
  }
}
