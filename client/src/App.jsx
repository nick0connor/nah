import { useState } from 'react';
import ProgressModal from './components/ProgressModal';
import Searchbox from './components/Searchbox';
import TorrentList from './components/TorrentList';
import { useTorrentManager } from './hooks/useTorrentManager';
import { useSocket } from './hooks/useSocket';
import './style/App.css';

// ALL CODE HERE IS UI OR CALLING LOGIC/DATA FUNCTIONS
function App() {
  const { downloadProgress, resetProgress } = useSocket();

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
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    handleSearch(searchText, mediaType).finally(() => setLoading(false));
  };

  const handleDownloadClick = async (index) => {
    console.log('Download clicked')
    handleDownload(index).finally(() => setModalActive(true));
  };

  const handleCancelClick = async () => {
    handleCancel(downloadProgress.infoHash).finally(() => {
      resetProgress();
      setModalActive(false);
    });
  };

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
        updateSearchText={setSearchText}
        isLoading={isLoading}
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
