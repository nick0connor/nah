import { useState } from 'react';
import ProgressModal from './components/ProgressModal';
import Searchbox from './components/Searchbox';
import TorrentList from './components/TorrentList';
import { useTorrentManager } from './hooks/useTorrentManager';
import { useSocket } from './hooks/useSocket';
import SocketToast from "./components/SocketToast";
import './style/App.css';

// ALL CODE HERE IS UI OR CALLING LOGIC/DATA FUNCTIONS
function App() {
  const { downloadProgress, resetProgress, isSocketOnline } = useSocket();

  const {
    queryResults,
    queryHasResults,
    mediaType,
    handleSearch,
    handleDownload,
    handleCancel,
    updateMediaType
  } = useTorrentManager();

  const [isModalActive, setModalActive] = useState(false);
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    handleSearch(searchText, mediaType).finally(() => setSearchLoading(false));
  };

  const handleDownloadClick = async (index) => {
    console.log('Download clicked')
    const result = await handleDownload(index);
    setModalActive(true);
  };

  const handleCancelClick = async () => {
    const result = await handleCancel();
    resetProgress();
    setModalActive(false);
  };

  return (
    <>
      <SocketToast isSocketOnline={isSocketOnline} />

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
        updateSearchText={setSearchText}
        isLoading={isSearchLoading}
      />

      <TorrentList
        queryResults={queryResults}
        queryHasResults={queryHasResults}
        downloadClick={handleDownloadClick}
      />
    </>
  );
}

export default App
