import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style/Searchbox.css';

function Searchbox({ 
  searchClick, 
  mediaType, 
  updateMediaType, 
  searchText, 
  updateSearchText, 
  isLoading,
  resultsLimit,
  setResultsLimit
}) {
  
  const radios = [
    { name: "Movie", value: "Movies" },
    { name: "TV Show", value: "TV" }
  ]

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
          onChange={(e) => updateMediaType(e.currentTarget.value)}
        >
          {radio.name}
        </ToggleButton>
      ))}
    </ButtonGroup>

    <div style={{paddingTop: '4px', paddingBottom: '4px'}}/>

    {/* Input Box + Button */}
    <Form
      className='d-flex align-items-center gap-2 w-100'
      onSubmit={(e) => searchClick(e)}
    >
      <Form.Control
        type="text"
        size='lg'
        className='search-input darkbg-whitetext'
        placeholder={mediaType == "Movies" ? "Movie name" : "Show name"}
        value={searchText}
        disabled={isLoading}
        onChange={(e) => updateSearchText(e.target.value)}
      />

      <Button
        variant='primary'
        size='lg'
        disabled={isLoading}
        className='search-button'
        type='submit'
      >
        <i className="bi bi-search"></i>
      </Button>
    </Form>

    <select 
      name="num-results-selector" 
      id="num-results-selector"
      onChange={(e) => setResultsLimit(e.target.value)}  
    >
      <option value="-1" selected={resultsLimit==-1}>MAX</option>
      <option value="10" selected={resultsLimit==10}>10</option>
      <option value="15" selected={resultsLimit==15}>15</option>
      <option value="20" selected={resultsLimit==20}>20</option>
      <option value="25" selected={resultsLimit==25}>25</option>
      <option value="30" selected={resultsLimit==30}>30</option>
    </select>
  </>);
}

export default Searchbox;