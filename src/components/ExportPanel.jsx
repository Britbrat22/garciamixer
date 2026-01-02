import React, { useState } from 'react'
import { masterAudio } from '../lib/masterChain'

const ExportPanel = ({ processedAudio }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    await masterAudio(processedAudio)
    setIsExporting(false)
  }

  return (
    <div>
      <h2 className="font-bold mb-2">Export</h2>
      <button
        className="px-4 py-2 bg-purple-600"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export WAV'}
      </button>
    </div>
  )
}

export default ExportPanel
