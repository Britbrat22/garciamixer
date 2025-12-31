import * as ort from 'onnxruntime-web'

let nsnetSession = null

export const loadNSNetModel = async () => {
  if (!nsnetSession) {
    nsnetSession = await ort.InferenceSession.create('/models/nsnet2.onnx', {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    })
  }
  return nsnetSession
}

export const cleanVoice = async (audioBuffer) => {
  try {
    const session = await loadNSNetModel()
    
    // Convert audio buffer to tensor
    const channelData = audioBuffer.getChannelData(0)
    const inputTensor = new ort.Tensor('float32', channelData, [1, 1, channelData.length])
    
    // Run inference
    const feeds = { input: inputTensor }
    const results = await session.run(feeds)
    
    // Process noise suppression results
    const cleanedData = results.output.data
    
    // Create new audio buffer
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
    
    // Copy cleaned data back to buffer
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = newBuffer.getChannelData(channel)
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = cleanedData[i] || 0
      }
    }
    
    return newBuffer
    
  } catch (error) {
    console.error('Voice cleaning error:', error)
    return audioBuffer // Return original on error
  }
}
