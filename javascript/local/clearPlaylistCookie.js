function clearPlaylistCookie() {
  // There can be multiple cookies with the name PlaylistTrackList(id), so we need to clear them all.
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    document.cookie = `${cookie};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
  // There can be multiple cookies with the name playlistTrackIds(id), so we need to clear them all.
  const cookies2 = document.cookie.split(";");
  for (let i = 0; i < cookies2.length; i++) {
    const cookie = cookies2[i];
    document.cookie = `${cookie};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
