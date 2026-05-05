import React, { useState, useEffect } from 'react'

type Message =
  | { type: 'PUSH_REQUEST'; components: unknown[] }
  | { type: 'PULL_RESPONSE'; uiJson: unknown[] }
  | { type: 'INIT'; port: string }
  | { type: 'ERROR'; message: string }

export default function App() {
  const [port, setPort] = useState('5173')
  const [status, setStatus] = useState('')

  useEffect(() => {
    window.onmessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as Message | undefined
      if (!msg) return

      if (msg.type === 'INIT') {
        setPort(msg.port)
      }

      if (msg.type === 'PUSH_REQUEST') {
        const url = `http://localhost:${port}/ui.json`
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg.components),
        })
          .then((res) => {
            if (res.ok) {
              setStatus('✓ Preview updated')
            } else {
              setStatus(`✗ Server error: ${res.status}`)
            }
          })
          .catch(() => {
            setStatus('✗ Cannot reach server — is `a2ui serve` running?')
          })
      }

      if (msg.type === 'ERROR') {
        setStatus(`✗ ${msg.message}`)
      }
    }
  }, [port])

  function onPush() {
    setStatus('Pushing...')
    parent.postMessage({ pluginMessage: { type: 'PUSH', port } }, '*')
  }

  function onPull() {
    setStatus('Pulling...')
    const url = `http://localhost:${port}/ui.json`
    fetch(url)
      .then((res) => res.json())
      .then((data: unknown) => {
        parent.postMessage({ pluginMessage: { type: 'PULL', data } }, '*')
        setStatus('✓ Pulled from preview')
      })
      .catch(() => {
        setStatus('✗ Cannot reach server — is `a2ui serve` running?')
      })
  }

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif', fontSize: 13 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Server Port</label>
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          style={{ width: '100%', padding: '4px 8px', boxSizing: 'border-box' }}
        />
      </div>
      <button
        onClick={onPush}
        style={{ width: '100%', marginBottom: 8, padding: '8px', cursor: 'pointer' }}
      >
        Push to Preview
      </button>
      <button
        onClick={onPull}
        style={{ width: '100%', marginBottom: 12, padding: '8px', cursor: 'pointer' }}
      >
        Pull from Preview
      </button>
      {status && (
        <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: 4 }}>
          {status}
        </div>
      )}
    </div>
  )
}
