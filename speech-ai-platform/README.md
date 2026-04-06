# 🎙️ VoiceForge AI — Speech Transcription, Translation & Enhancement Platform

> **Built by Nishika** | Enterprise-grade AI speech processing powered by AssemblyAI & Google Gemini

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![AssemblyAI](https://img.shields.io/badge/AssemblyAI-Speech--to--Text-5E2FDB?style=flat-square)](https://assemblyai.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)

---

## ✨ Features

| Feature | Technology |
|---------|-----------|
| 🎤 Live audio recording with waveform | Web Audio API + Canvas |
| 📁 File upload (MP3, WAV, M4A, OGG, MP4, WEBM) | Flask + AssemblyAI |
| 🔤 Automatic Speech Recognition | AssemblyAI |
| 👥 Speaker Diarization | AssemblyAI |
| 📊 Real-time waveform visualization | Canvas API |
| 🌍 Multilingual Translation (20+ languages) | Google Gemini |
| ✨ AI Summarization (4 styles) | Google Gemini |
| 🪄 Text Enhancement & Correction | Google Gemini |
| 🧠 Deep Analysis (entities, sentiment, topics) | Google Gemini |
| 🌙 Dark / Light / System theme | CSS Variables |
| 📋 Copy & Download outputs | Browser APIs |

---

## 🛠️ Tech Stack

**Backend**
- **Flask** — Python web framework
- **AssemblyAI Python SDK** — Speech-to-text with speaker diarization
- **Google Generative AI (Gemini 1.5 Flash)** — Translation, summarization, enhancement
- **Flask-CORS** — Cross-origin resource sharing
- **python-dotenv** — Environment variables

**Frontend**
- **React 18** + **Vite** — Modern frontend tooling
- **Web Audio API** — Real-time waveform visualization
- **Lucide React** — Icon library
- **Axios** — HTTP client

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- AssemblyAI API key → [assemblyai.com/app](https://www.assemblyai.com/app/)
- Gemini API key → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/voiceforge-ai.git
cd voiceforge-ai
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys:
# ASSEMBLYAI_API_KEY=your_key_here
# GEMINI_API_KEY=your_key_here

# Start the server
python app.py
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Open in Browser

Navigate to **http://localhost:3000** 🎉

---

## 🔑 Getting API Keys

### AssemblyAI (Free tier available)
1. Go to [assemblyai.com](https://www.assemblyai.com)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add to `backend/.env` as `ASSEMBLYAI_API_KEY`

### Google Gemini (Free tier available)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key
4. Add to `backend/.env` as `GEMINI_API_KEY`

---

## 📁 Project Structure

```
voiceforge-ai/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment template
│   └── utils/
│       ├── assemblyai_handler.py # Speech-to-text logic
│       └── gemini_handler.py     # AI translation/summary/enhance
│
├── frontend/
│   ├── index.html                # HTML entry point
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── public/
│   │   └── favicon.svg           # App icon
│   └── src/
│       ├── App.jsx               # Root component & state
│       ├── main.jsx              # React entry point
│       ├── index.css             # Design system & global styles
│       ├── api/
│       │   └── speechApi.js      # API client functions
│       ├── hooks/
│       │   ├── useTheme.js       # Dark/light/system theme
│       │   └── useAudioRecorder.js # Browser recording logic
│       └── components/
│           ├── Header.jsx        # Navigation + theme toggle
│           ├── Hero.jsx          # Landing section
│           ├── AudioRecorder.jsx # Live mic recording
│           ├── FileUploader.jsx  # Drag-drop file upload
│           ├── TranscriptionPanel.jsx  # Transcript display
│           ├── TranslationPanel.jsx    # Translation output
│           ├── SummaryPanel.jsx        # Summarization output
│           ├── EnhancementPanel.jsx    # Text enhancement
│           ├── AnalysisPanel.jsx       # Deep analysis
│           └── Footer.jsx        # Footer
│
├── .gitignore
├── README.md
└── DEPLOY.md                     # Deployment guide
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Upload & transcribe audio file |
| `POST` | `/api/transcribe/url` | Transcribe from URL |
| `POST` | `/api/translate` | Translate text |
| `POST` | `/api/summarize` | Summarize text |
| `POST` | `/api/enhance` | Enhance/correct text |
| `POST` | `/api/analyze` | Deep text analysis |
| `GET` | `/api/languages` | Get supported languages |

---

## 🚢 Deployment

See [DEPLOY.md](./DEPLOY.md) for full deployment instructions including:
- GitHub setup & push
- Backend deployment (Railway / Render)
- Frontend deployment (Vercel / Netlify)

---

## 📜 License

MIT License — Built by **Nishika**
