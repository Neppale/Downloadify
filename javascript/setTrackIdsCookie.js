function setTrackIdsCookie(trackIds) {
  // For every 140 trackIds, we need to create a new cookie, because the maximum size of a cookie is 4096 bytes.

  const numberOfCookies = Math.ceil(trackIds.length / 140);
  const trackIdsPerCookie = Math.ceil(trackIds.length / numberOfCookies);

  for (let i = 0; i < numberOfCookies; i++) {
    const cookieName = `playlistTrackIds${i}`;
    const cookieValue = trackIds
      .slice(i * trackIdsPerCookie, (i + 1) * trackIdsPerCookie)
      .join(",");
    document.cookie = `${cookieName}=${cookieValue};path=/`;
  }
}
