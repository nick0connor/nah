import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import '../style/TorrentList.css'

function TorrentList({
  queryResults,
  queryHasResults,
  downloadClick
}) {

  return (<>
    <ListGroup as="ol" numbered>

      {queryHasResults &&
        queryResults.map((result, index) => {
          return (
            <ListGroup.Item
              as="li"
              className='darkbg-whitetext torrent-item'
              key={index}
            >
              <div className='torrent-info'>
                <p className='torrent-title'>{result.title}</p>
                <div className='torrent-meta'>
                  <Badge bg='success' pill>↑ {result.seeds}</Badge>
                  <Badge bg='danger' pill>↓ {result.peers}</Badge>
                  <Badge bg='primary' pill>{result.size}</Badge>
                </div>
              </div>

              <div className='torrent-download'>
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => downloadClick(result.link)}
                >
                  Download
                </Button>
              </div>
            </ListGroup.Item>
          );
        })
      }

    </ListGroup>
  </>);
}

export default TorrentList;