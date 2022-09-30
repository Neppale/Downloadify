async function getBearerToken() {
  const header = {
    Authorization:
      "Basic MTAxYjYzNzdjZTFkNDllOTg1YzQzMDE0NmFmMTE2ZjU6Mjk0YzI3YTE2ZWRhNGIyYjlkOWU3ZTIyMmU1ODFkMTI",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: header,
    body: "grant_type=client_credentials",
  }).then((response) => response.json());

  return `Bearer ${response.access_token}`;
}
