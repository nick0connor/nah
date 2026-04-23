import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';

function TorrentList({
  queryResults,
  queryResultsActive,
  downloadClick
}) {

  return (<>
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
                onClick={() => downloadClick(index)}
                style={{ color: "black" }}
              >
                Download
              </Badge>
            </ListGroup.Item>
          );
        })
      }

    </ListGroup>
  </>);
}

export default TorrentList;