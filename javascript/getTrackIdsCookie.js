function getTrackIdsCookie() {
  // There can be multiple cookies with the name playlistTrackIds(id), so we need to get them all.
  const cookies = document.cookie.split(";");
  const trackIds = [];
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    if (cookie.includes("playlistTrackIds")) {
      const cookieValue = cookie.split("=")[1];
      const cookieTrackIds = cookieValue.split(",");
      trackIds.push(...cookieTrackIds);
    }
  }
  return trackIds;
}
