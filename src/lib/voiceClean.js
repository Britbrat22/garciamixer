import * as ort from 'onnxruntime-web'

let nsnetSession = null

export const loadNSNetModel = async () => {
  if (!nsnetSession) {
    nsnetSession = await ort.InferenceSession.create('/models/nsnet2.onnx')
  }
  return nsnetSession
}

export const cleanVoice = async (audioBuffer) => {
  await loadNSNetModel()
  // TODO: noise suppression
  return audioBuffer
}
