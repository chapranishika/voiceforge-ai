# 🚀 VoiceForge AI — Deployment Guide

Complete step-by-step guide to deploy to GitHub and host online.

---

## PART 1 — Push to GitHub

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) → **Sign in**
2. Click **"+"** (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `voiceforge-ai`
   - **Description**: `AI Speech Transcription, Translation & Enhancement Platform`
   - **Visibility**: Public (or Private)
   - ❌ Don't initialize with README (we have one)
4. Click **"Create repository"**

---

### Step 2: Initialize Git & Push

Open terminal in your project root (`voiceforge-ai/`):

```bash
# Initialize git repository
git init

# Add all files (the .gitignore will exclude .env, node_modules, etc.)
git add .

# First commit
git commit -m "🎙️ Initial commit: VoiceForge AI — Speech Transcription Platform

- Flask backend with AssemblyAI speech-to-text
- Google Gemini for translation, summarization & enhancement
- React + Vite frontend with dark/light/system theme
- Real-time waveform visualization
- Speaker diarization support
- 20+ language translation
- Deep text analysis

Built by Nishika"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/voiceforge-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

### Step 3: Add GitHub Repository Topics (Optional but good)

On GitHub, click the ⚙️ gear next to "About" and add topics:
```
speech-to-text  nlp  flask  react  assemblyai  gemini  ai  python  javascript  transcription
```

---

## PART 2 — Deploy Backend (Railway — Recommended Free Option)

### Railway Deployment

1. Go to [railway.app](https://railway.app) → **Sign up with GitHub**
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `voiceforge-ai` repository
4. Set **Root Directory** to `backend`
5. Railway auto-detects Python — if not, set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
6. Go to **Variables** tab → Add:
   ```
   ASSEMBLYAI_API_KEY = your_key_here
   GEMINI_API_KEY = your_key_here
   ```
7. Deploy → Copy your Railway URL (e.g., `https://voiceforge-ai-backend.up.railway.app`)

### Alternative: Render (Free tier)

1. Go to [render.com](https://render.com) → **Sign up**
2. **New** → **Web Service** → Connect GitHub → Select repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Environment**: Python 3
4. Add Environment Variables (same as above)
5. Deploy!

---

## PART 3 — Deploy Frontend (Vercel — Recommended)

### Vercel Deployment

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Click **"New Project"** → Import `voiceforge-ai`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   ```
   VITE_API_URL = https://your-backend.railway.app/api
   ```
   *(Replace with your actual Railway/Render backend URL)*
5. Deploy!

### Alternative: Netlify

1. Go to [netlify.com](https://netlify.com) → **Sign up**
2. **Add new site** → **Import from Git** → GitHub → Select repo
3. Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. **Environment variables**: Add `VITE_API_URL`
5. Deploy!

---

## PART 4 — Connect Frontend to Backend

After both are deployed:

1. Copy your **backend URL** from Railway/Render
2. Go to **Vercel/Netlify** → Your project → **Environment Variables**
3. Update `VITE_API_URL` to `https://your-backend-url.railway.app/api`
4. **Redeploy** the frontend

---

## PART 5 — Keep Code Updated

After making changes:

```bash
# Check what changed
git status

# Stage all changes
git add .

# Commit with a meaningful message
git commit -m "✨ feat: add [your feature description]"

# Push to GitHub (auto-deploys on Railway/Vercel)
git push
```

---

## 🔒 Security Checklist

- [ ] `.env` files are in `.gitignore` — **never commit API keys**
- [ ] Backend environment variables set in Railway/Render dashboard
- [ ] Frontend environment variables set in Vercel/Netlify dashboard
- [ ] CORS configured to only allow your frontend domain in production

---

## 🌐 Final URLs

| Service | URL |
|---------|-----|
| GitHub Repo | `https://github.com/YOUR_USERNAME/voiceforge-ai` |
| Backend API | `https://voiceforge-ai-backend.up.railway.app/api/health` |
| Frontend App | `https://voiceforge-ai.vercel.app` |

---

## 🆘 Troubleshooting

**Backend not starting on Railway?**
- Check logs in Railway dashboard
- Ensure `requirements.txt` is correct
- Verify env variables are set

**Frontend can't reach backend?**
- Check `VITE_API_URL` is set correctly (no trailing slash before `/api`)
- Backend CORS allows your Vercel domain
- Test backend health: `curl https://your-backend.railway.app/api/health`

**Transcription not working?**
- Verify `ASSEMBLYAI_API_KEY` is valid
- Check file format is supported
- Check backend logs for error details

---

*Built by Nishika — VoiceForge AI*
