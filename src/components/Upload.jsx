import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const Upload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('audio/')) {
      onFileUpload(file)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="border border-dashed p-6 mb-4 cursor-pointer"
    >
      <input {...getInputProps()} />
      <p>Drag & drop an audio file, or click to select</p>
    </div>
  )
}

export default Upload
