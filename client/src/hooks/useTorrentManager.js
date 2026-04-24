import { useState } from 'react';
import { search, download, cancel } from '../services/api';

// ALL CODE HERE IS LOGIC/DATA ACTIONS
export function useTorrentManager(){

    const [mediaType, setMediaType] = useState("Movies");
    const [queryResults, setQueryResults] = useState([]);

    let queryHasResults = (queryResults && queryResults.length > 0);

    const handleSearch = async (searchText, mediaType) => {
        const results = await search(searchText, mediaType)
        setQueryResults(results);
    };

    const handleDownload = async (index) => {
        if(!queryHasResults) return;
        const results = await download(index);
        return results;
    };

    const handleCancel = async (infoHash) => {
        const results = await cancel(infoHash);
        return results;
    };

    const updateMediaType = (type) => { setMediaType(type); }

    return {
        queryResults,
        queryHasResults,
        mediaType,
        handleSearch,
        handleDownload,
        handleCancel,
        updateMediaType
    };
}