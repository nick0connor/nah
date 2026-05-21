import { useState } from 'react';
import { search, download, cancel } from '../services/api';

// ALL CODE HERE IS LOGIC/DATA ACTIONS
export function useTorrentManager(){

    const [mediaType, setMediaType] = useState("Movies");
    const [queryResults, setQueryResults] = useState([]);

    const queryHasResults = () => ( queryResults && queryResults.length > 0);

    const handleSearch = async (searchText, mediaType, limit) => {
        const results = await search(searchText, mediaType, limit);
        setQueryResults(results);
    };

    const [currentInfoHash, setCurrentInfoHash] = useState("");
    
    const handleDownload = async (link) => {
        // if(!queryHasResults) return;
        const results = await download(link);

        console.log("Results of Download: ", results);
        // setCurrentInfoHash(results.infoHash);
        return results;
    };

    const handleCancel = async () => {
        const results = await cancel(currentInfoHash);
        setCurrentInfoHash("");
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