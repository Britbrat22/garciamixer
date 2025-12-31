import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const Upload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file)
      onFileUpload({ file, url, name: file.name })
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac']
    },
    maxFiles: 1
  })

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-2">🎵</div>
        <p className="text-lg">
          {isDragActive ? 'Drop your audio here...' : 'Drag & drop audio file or click to select'}
        </p>
        <p className="text-sm text-gray-400 mt-2">Supports MP3, WAV, M4A, FLAC</p>
      </div>
    </div>
  )
}

export default Upload
