import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';

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

  // Temp code for searchbox - replace with real network request to backend
  useEffect(() => { 
    function simulateNetworkRequest() {
      return new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
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

    </>
  )
}

export default App
