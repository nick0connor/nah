import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Settings() {

  const [isEditingAllowed, setEditingAllowed] = useState(false);

  const [formPaths, setFormPaths] = useState({ Movies: '', TV: '' });

  useEffect(() => {
    fetch('http://localhost:3000/settings/paths')
      .then(res => res.json())
      .then(data => setFormPaths(data));
  }, []);

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3000/settings/paths', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPaths)
    });
    const data = await res.json();
    if (data.response === 'saved') setEditingAllowed(false);
  };

  return (
    <>
      <a href="/" style={{ position: 'fixed', top: '16px', left: '16px' }}>
        <i className="bi bi-house-fill" style={{ fontSize: '1.5rem', color: 'white' }} />
      </a>

      <Button
        variant={isEditingAllowed ? 'success' : 'danger'}
        onClick={() => setEditingAllowed(!isEditingAllowed)}
      >
        {isEditingAllowed ? "Editing is Enabled" : "Editing is Disabled"}
      </Button>

      <section className='paths'>
        <h1 style={{ color: 'white' }}>Download Paths</h1>


        <Form
          className='align-items-center gap-2 w-100'
        // onSubmit={(e) => searchClick(e)}
        >
          <Form.Label style={{ color: "white" }}>Movies</Form.Label>
          <Form.Control
            value={formPaths.Movies}
            onChange={(e) => setFormPaths({ ...formPaths, Movies: e.target.value })}
            disabled={!isEditingAllowed}
          />

          <hr />

          <Form.Label style={{ color: "white" }}>Shows</Form.Label>
          <Form.Control
            value={formPaths.TV}
            onChange={(e) => setFormPaths({ ...formPaths, TV: e.target.value })}
            disabled={!isEditingAllowed}
          />

          <hr />

          <Button onClick={handleSubmit} disabled={!isEditingAllowed}>Submit Changes</Button>
        </Form>
      </section>
    </>
  );
}

export default Settings;