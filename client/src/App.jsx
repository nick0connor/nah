import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import fakeQuery from './queryReturnTemplate.json'
import './App.css';

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
      console.log(data)
      setQueryResults(data);
    } 
    finally {
      setLoading(false);
    }   
  };

  // Results
  const [queryResults, setQueryResults] = useState([]);
  var queryResultsActive = () => { return queryResults !== []; }

  const handleDownloadClick = async (_index) => {
    if(!queryResultsActive) return;
    
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

  // Modal
  const [isModalActive, setModalActive] = useState(true);
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
            Download Progress
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger'>Cancel</Button>
          <Button 
            variant='success'
            // disabled={true}
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
      <VerticallyCenteredModal show={isModalActive}/>

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
