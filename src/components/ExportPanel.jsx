import React, { useState } from 'react'
import { masterAudio } from '../lib/masterChain'

const ExportPanel = ({ processedAudio }) => {
  const [exportFormat, setExportFormat] = useState('wav')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!processedAudio) return
    
    setIsExporting(true)
    try {
      const masteredBuffer = await masterAudio(processedAudio)
      
      // Convert audio buffer to blob
      const offlineContext = new OfflineAudioContext(
        masteredBuffer.numberOfChannels,
        masteredBuffer.length,
        masteredBuffer.sampleRate
      )
      
      const source = offlineContext.createBufferSource()
      source.buffer = masteredBuffer
      source.connect(offlineContext.destination)
      source.start()
      
      const renderedBuffer = await offlineContext.startRendering()
      
      // Create WAV blob
      const length = renderedBuffer.length * renderedBuffer.numberOfChannels * 2
      const buffer = new ArrayBuffer(44 + length)
      const view = new DataView(buffer)
      
      // WAV header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i))
        }
      }
      
      writeString(0, 'RIFF')
      view.setUint32(4, 36 + length, true)
      writeString(8, 'WAVE')
      writeString(12, 'fmt ')
      view.setUint32(16, 16, true)
      view.setUint16(20, 1, true)
      view.setUint16(22, renderedBuffer.numberOfChannels, true)
      view.setUint32(24, renderedBuffer.sampleRate, true)
      view.setUint32(28, renderedBuffer.sampleRate * 2 * renderedBuffer.numberOfChannels, true)
      view.setUint16(32, renderedBuffer.numberOfChannels * 2, true)
      view.setUint16(34, 16, true)
      writeString(36, 'data')
      view.setUint32(40, length, true)
      
      let offset = 44
      for (let i = 0; i < renderedBuffer.length; i++) {
        for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]))
          view.setInt16(offset, sample * 0x7FFF, true)
          offset += 2
        }
      }
      
      const blob = new Blob([buffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      
      // Download file
      const a = document.createElement('a')
      a.href = url
      a.download = `processed_audio.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Export</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Format</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
          >
            <option value="wav">WAV (Uncompressed)</option>
            <option value="mp3">MP3 (Compressed)</option>
          </select>
        </div>
        
        <button
          onClick={handleExport}
          disabled={!processedAudio || isExporting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 
            hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg 
            font-semibold transition-all"
        >
          {isExporting ? 'Exporting...' : 'Export Audio'}
        </button>
        
        {!processedAudio && (
          <p className="text-sm text-gray-400 text-center">
            Process audio first to enable export
          </p>
        )}
      </div>
    </div>
  )
}

export default ExportPanel
