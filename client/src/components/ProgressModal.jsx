import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ProgressModal({ data, cancelClick, closeClick, ...props }) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Progress for {`${data.infoHash}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Progress: ${data.progress}%\nSpeed: ${data.speed} MB/s`}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='danger'
          onClick={cancelClick}
        >
          Cancel
        </Button>
        <Button
          variant='success'
          disabled={data.progress != "100.00"}
          onClick={closeClick}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProgressModal;