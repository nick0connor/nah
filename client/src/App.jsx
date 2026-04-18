import { useState } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

function App() {
  const [mediaType, setMediaType] = useState("movie")
  const radios = [
    { name:"Movie",   value:"movie" },
    { name:"TV Show", value:"tvshow" }
  ]

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

      
    </>
  )
}

export default App
