import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client';

import ProgressModal from './components/ProgressModal';
import Searchbox from './components/Searchbox';
import TorrentList from './components/TorrentList';

import { search, download, cancel } from './services/api';
import { useSocket } from './hooks/useSocket';

import fakeQuery from './queryReturnTemplate.json'
import './style/App.css';

function App() {
  const { downloadProgress, resetProgress } = useSocket();

  const [mediaType, setMediaType] = useState("Movies")
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const updateMediaType = (type) => { setMediaType(type); }
  const updateSearchText = (text) => { setSearchText(text) }

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setQueryResults(await search(searchText, mediaType));
    } 
    finally {
      setLoading(false);
    }   
  };

  // Results
  const [queryResults, setQueryResults] = useState([]);
  let queryHasResults = (queryResults && queryResults.length > 0);

  const handleDownloadClick = async (_index) => {
    if(!queryHasResults){
      console.log("NO ACTIVE LIST: index pointing to nothing");
      return;
    }
    console.log('Download clicked')
    try{
      console.log(await download(_index));
    }
    finally {
      setModalActive(true);
    }
  }

  // Modal
  const [isModalActive, setModalActive] = useState(false);

  const handleCancelClick = async () => {
    try{
      console.log(await cancel(downloadProgress.infoHash));
    }
    finally {
      resetProgress();
      setModalActive(false);
    }
  }

  
  return (
    <>
      <ProgressModal 
        data={downloadProgress}
        cancelClick={handleCancelClick}
        closeClick={() => setModalActive(false)}
        show={isModalActive} animation={false}
      />

      <Searchbox 
        searchClick={handleSearchClick}
        mediaType={mediaType}
        updateMediaType={updateMediaType}
        searchText={searchText}
        updateSearchText={updateSearchText}
        isLoading={isLoading}
      />

      <TorrentList
        queryResults={queryResults}
        queryResultsActive={queryHasResults}
        downloadClick={handleDownloadClick}
      />
    </>
  )
}

export default App
