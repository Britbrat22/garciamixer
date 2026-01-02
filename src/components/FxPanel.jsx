import React, { useState } from 'react'

const FxPanel = () => {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="mb-4">
      <h2 className="font-bold mb-2">FX Panel</h2>
      <button
        className="px-4 py-2 bg-blue-600"
        onClick={() => setEnabled(!enabled)}
      >
        FX {enabled ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export default FxPanel
