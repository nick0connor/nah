import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import fakeQuery from './queryReturnTemplate.json'

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
  var query = "";

  const handleSearchClick = (e) => {
    e.preventDefault();

    query = searchText;
    console.log(`Query: '${query}'`);
    
    setLoading(true)
  };

  // Results
  const [queryResults, setQueryResults] = useState([]);
  var queryResultsActive = () => { return queryResults !== []; }

  const handleDownloadClick = (index) => {
    if(!queryResultsActive) return;
    console.log(`Hash: '${queryResults[index].hash}'`)
  }

  // Temp code for searchbox - replace with real network request to backend
  useEffect(() => { 
    function simulateNetworkRequest() {
      return new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setQueryResults(fakeQuery);
        setLoading(false);
      });
    }
  }, [isLoading]);
  

  return (
    <>
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
            className='flex-grow-1'
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

        <p>{searchText}</p>
      </section>

      <section className='results'>
        <ListGroup as="ol" numbered>

        {queryResultsActive && 
          queryResults.map((result, index) => {
            return (
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                key={index}
              >
                <div className="ms-2 me-auto fw-bold">{result.name}</div>
                
                <Badge bg="success" pill>
                  {result.seeders}
                </Badge>
                <Badge bg="danger" pill>
                  {result.leachers}
                </Badge>
                <Badge bg="primary">
                  {result.size} 
                </Badge>
                <Button
                  size='sm'
                  variant='outline-primary'
                  onClick={() => handleDownloadClick(index)}
                >
                  Download
                </Button>
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
