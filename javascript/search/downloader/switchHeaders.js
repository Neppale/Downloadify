async function switchHeaders() {
  const headerOptions = [
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "5056bad1f9mshec21fae15b7979ep1d88a9jsnd53db7f0b8c8",
        "X-RapidAPI-Host": "simple-youtube-search.p.rapidapi.com",
      },
    },
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "2be4671a60mshd26219b033393e8p12eceajsn5bf47203341f",
        "X-RapidAPI-Host": "simple-youtube-search.p.rapidapi.com",
      },
    },
  ];

  const randomIndex = Math.floor(Math.random() * headerOptions.length);
  return headerOptions[randomIndex];
}
