import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Searchbox({ searchClick, mediaType, searchText, setSearchText, isLoading}) {
  return (<>
    <Form
      className='d-flex align-items-center gap-2 w-100'
      onSubmit={searchClick}
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