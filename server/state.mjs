export let currentSearchResults = [];
export let mediaType = '';

export function setCurrentSearchResults(newerResults) {
    currentSearchResults = newerResults;
}

export function setMediaType(newType) {
    mediaType = newType;
}