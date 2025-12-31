import * as ort from 'onnxruntime-web'

let demucsSession = null

export const loadDemucsModel = async () => {
  if (!demucsSession) {
    demucsSession = await ort.InferenceSession.create('/models/demucs.onnx', {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    })
  }
  return demucsSession
}

export const separateStems = async (audioBuffer) => {
  try {
    const session = await loadDemucsModel()
    
    // Convert audio buffer to tensor
    const channelData = audioBuffer.getChannelData(0)
    const inputTensor = new ort.Tensor('float32', channelData, [1, channelData.length])
    
    // Run inference
    const feeds = { input: inputTensor }
    const results = await session.run(feeds)
    
    // Process results (simplified - actual implementation would be more complex)
    const separatedData = results.output.data
    
    // Create new audio buffer with separated stems
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )
    
    const newBuffer = offlineContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )
    
    // Copy processed data back to buffer
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = newBuffer.getChannelData(channel)
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = separatedData[i] || 0
      }
    }
    
    return newBuffer
    
  } catch (error) {
    console.error('Stem separation error:', error)
    return audioBuffer // Return original on error
  }
}
