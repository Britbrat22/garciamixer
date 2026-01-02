import React, { useState } from 'react'
import Upload from './components/Upload'
import Player from './components/Player'
import FxPanel from './components/FxPanel'
import ExportPanel from './components/ExportPanel'

function App() {
  const [audioFile, setAudioFile] = useState(null)
  const [processedAudio, setProcessedAudio] = useState(null)

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Audio Tool</h1>

      <Upload onFileUpload={setAudioFile} />

      {audioFile && (
        <Player
          audioFile={audioFile}
          onProcess={setProcessedAudio}
        />
      )}

      <FxPanel />

      {processedAudio && (
        <ExportPanel processedAudio={processedAudio} />
      )}
    </div>
  )
}

export default App
