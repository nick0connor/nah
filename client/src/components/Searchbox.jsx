import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

function Searchbox({ searchClick }) {
  const [mediaType, setMediaType] = useState("movie")
  const radios = [
    { name: "Movie", value: "movie" },
    { name: "TV Show", value: "tvshow" }
  ]
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (<>
    {/* Media Buttons */}
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

    {/* Input Box + Button */}
    <Form
      className='d-flex align-items-center gap-2 w-100'
      onSubmit={(e) => searchClick(e, searchText, mediaType, setLoading)}
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
  </>);
}

export default Searchbox;