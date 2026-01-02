import React from 'react'
import WavesurferPlayer from '@wavesurfer/react'

const Player = ({ audioFile, onProcess }) => {
  const url = URL.createObjectURL(audioFile)

  return (
    <div className="mb-4">
      <WavesurferPlayer
        url={url}
        height={80}
        waveColor="#888"
        progressColor="#4ade80"
      />

      <button
        className="mt-2 px-4 py-2 bg-green-600"
        onClick={() => onProcess(audioFile)}
      >
        Process Audio
      </button>
    </div>
  )
}

export default Player
