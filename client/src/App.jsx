import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client';

import ProgressModal from './components/ProgressModal';
import Searchbox from './components/Searchbox';
import TorrentList from './components/TorrentList';

import { search } from './services/api';

import fakeQuery from './queryReturnTemplate.json'
import './style/App.css';

function App() {
  const handleSearchClick = async (e, searchText, mediaType, setLoading) => {
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
  var queryResultsActive = () => { return !queryResults || queryResults.length === 0 }

  const handleDownloadClick = async (_index) => {
    if(!queryResultsActive) return;

    console.log("Download Button Pressed");
    
    try{
      const res = await fetch("http://localhost:3000/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({index: _index})
      });

      const data = await res.json();
      console.log(data);
    }
    finally {
      setModalActive(true);
    }
  }

  // THROTTLE THE SOCKET UPDATES!!!!
  const lastUpdateRef = useRef(0);

  // Socket
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Socket connected to server");
    })

    socket.on("progress", (progressData) => {
      const now = Date.now();

      if (now - lastUpdateRef.current > 500){ // 500 ms
        setDownloadProgress(progressData);
        lastUpdateRef.current = now;
      }
    });

    return () => {
      console.log("Socket disconnected");
      socket.disconnect();
    };
  }, []);

  // Modal
  const [isModalActive, setModalActive] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    infoHash: "",
    progress: "",
    speed: ""
  })
  const handleCancelClick = async () => {
    try{
      console.log("Pressed Cancel");
      const res = await fetch("http://localhost:3000/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ infoHash: downloadProgress.infoHash })
      });
      const data = await res.json();
      console.log(data);
    }
    finally {
      setDownloadProgress({
        infoHash: "",
        progress: "",
        speed: ""
      });
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
      />

      <TorrentList
        queryResults={queryResults}
        queryResultsActive={queryResultsActive}
        downloadClick={handleDownloadClick}
      />
    </>
  )
}

export default App
