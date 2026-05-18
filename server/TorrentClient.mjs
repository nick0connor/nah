import WebTorrent from "webtorrent";

const torrentClient = new WebTorrent({ torrentPort: 6882, dhtPort: 6883 });
torrentClient.on('error', (err) => {
  console.error('WebTorrent Error: ', err.message);
});

export default torrentClient;