// TODO: Replace this vibe coded file
import { useState } from 'react';

function FileSelector({ fileList, onConfirm }) {
  const [selected, setSelected] = useState([]);

  if (!fileList) return null;

  const toggle = (index) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{ background: '#333', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
        <h3 style={{ color: 'white' }}>Select Files</h3>

        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '16px' }}>
          {fileList.files.map((f) => (
            <div key={f.index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
              <input
                type="checkbox"
                checked={selected.includes(f.index)}
                onChange={() => toggle(f.index)}
              />
              <span style={{ color: 'white', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {f.path} — {f.size} 
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onConfirm(fileList.infoHash, selected)}
          disabled={selected.length === 0}
          style={{ padding: '8px 20px', cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          Download Selected ({selected.length})
        </button>
      </div>
    </div>
  );
}

export default FileSelector;