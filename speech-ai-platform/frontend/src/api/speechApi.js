import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 min for long audio files
})

// Upload audio file for transcription
export async function uploadAudio(file, options = {}, onProgress) {
  const formData = new FormData()
  formData.append('audio', file)
  formData.append('speaker_labels', options.speakerLabels ?? true)
  formData.append('auto_chapters', options.autoChapters ?? false)
  formData.append('sentiment_analysis', options.sentimentAnalysis ?? false)
  formData.append('entity_detection', options.entityDetection ?? false)

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total))
      }
    },
  })
  return response.data
}

// Transcribe from URL
export async function transcribeUrl(url, options = {}) {
  const response = await api.post('/transcribe/url', { url, ...options })
  return response.data
}

// Translate text
export async function translateText(text, targetLanguage, sourceLanguage = 'auto') {
  const response = await api.post('/translate', {
    text,
    target_language: targetLanguage,
    source_language: sourceLanguage,
  })
  return response.data
}

// Summarize text
export async function summarizeText(text, style = 'concise') {
  const response = await api.post('/summarize', { text, style })
  return response.data
}

// Enhance text
export async function enhanceText(text, type = 'grammar') {
  const response = await api.post('/enhance', { text, type })
  return response.data
}

// Analyze text
export async function analyzeText(text) {
  const response = await api.post('/analyze', { text })
  return response.data
}

// Get supported languages
export async function getLanguages() {
  const response = await api.get('/languages')
  return response.data
}

// Health check
export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}
