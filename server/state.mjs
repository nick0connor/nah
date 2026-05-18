export let mostRecentTorrent = [];
export let mediaType = '';

export function setMostRecentTorrent(newerTorrent) {
    mostRecentTorrent = newerTorrent;
}

export function setMediaType(newType) {
    mediaType = newType;
}