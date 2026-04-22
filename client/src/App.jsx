import { useEffect, useState, useRef } from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { io } from 'socket.io-client';

import fakeQuery from './queryReturnTemplate.json'
import './style/App.css';

function App() {
  // Media Type
  const [mediaType, setMediaType] = useState("movie")
  const radios = [
    { name:"Movie",   value:"movie" },
    { name:"TV Show", value:"tvshow" }
  ]

  // Searchbox
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          query: searchText, 
          media: mediaType
        })
      });

      const data = await res.json();
      // console.log(data)
      setQueryResults(data);
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
      // console.log(data);
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

  function VerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Progress for {`${downloadProgress.infoHash}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Progress: ${downloadProgress.progress}%\nSpeed: ${downloadProgress.speed} MB/s`}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant='danger'
            disabled={ false }
            onClick={() => handleCancelClick()}
          >
            Cancel
          </Button>
          <Button 
            variant='success'
            disabled={ downloadProgress.progress != "100.00" }
            onClick={() => setModalActive(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  return (
    <>
      <VerticallyCenteredModal show={isModalActive} animation={false}/>

      <section className='mediaTypeSelector'>
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant={mediaType === radio.value ? 'success' : 'outline-secondary'}
              name="radio"
              size="lg"
              value={radio.value}
              checked={mediaType === radio.value}
              onChange={(e) => setMediaType(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </section>

      <section className='searchBox'>
        <Form 
          className='d-flex align-items-center gap-2 w-100'
          onSubmit={handleSearchClick}
        >
          <Form.Control 
            type="text" 
            size='lg'
            className='flex-grow-1 darkbg-whitetext'
            style={{ flex: "0 0 80%" }}
            placeholder={mediaType == "movie" ? "Movie name" : "Show name"}
            value={searchText}
            disabled={isLoading}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Button 
            variant='primary'
            size='lg'
            disabled={isLoading}
            style={{ flex: "0 0 20%" }}
            type='submit'
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Form>
      </section>

      <section className='results'>
        <ListGroup as="ol" numbered>

        {queryResultsActive && 
          queryResults.map((result, index) => {
            return (
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start darkbg-whitetext"
                key={index}
              >
                <p className="ms-2 me-auto text-wrap text-break fs-6 fw-normal">{result.title}</p>
                
                <Badge bg="success" pill>
                  ↑ {result.seeds}
                </Badge>
                <Badge bg="danger" pill>
                  ↓ {result.peers}
                </Badge>
                <Badge bg="primary">
                  {result.size} 
                </Badge>
                <Badge
                  as={Button}
                  size='sm'
                  bg="light"
                  onClick={() => handleDownloadClick(index)}
                  style={{color:"black"}}
                >
                  Download
                </Badge>
              </ListGroup.Item>
            );
          })
        }

        </ListGroup>
      </section>
    </>
  )
}

export default App
