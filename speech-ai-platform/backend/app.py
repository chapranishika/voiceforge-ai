"""
VoiceForge AI — Speech Transcription, Translation & Enhancement Platform
Backend API built with Flask | By Nishika
"""
from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import tempfile
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from utils.assemblyai_handler import AssemblyAIHandler
from utils.gemini_handler import GeminiHandler

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Init handlers
aai_handler = AssemblyAIHandler(api_key=os.getenv("ASSEMBLYAI_API_KEY"))
gemini_handler = GeminiHandler(api_key=os.getenv("GEMINI_API_KEY"))

UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {"mp3", "mp4", "wav", "m4a", "ogg", "flac", "webm", "aac"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "VoiceForge AI is running", "version": "1.0.0"})


@app.route("/api/upload", methods=["POST"])
def upload_audio():
    """Upload audio file and start transcription."""
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files["audio"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"File type not supported. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

    options = {
        "speaker_labels": request.form.get("speaker_labels", "true").lower() == "true",
        "auto_chapters": request.form.get("auto_chapters", "false").lower() == "true",
        "sentiment_analysis": request.form.get("sentiment_analysis", "false").lower() == "true",
        "entity_detection": request.form.get("entity_detection", "false").lower() == "true",
        "punctuate": True,
        "format_text": True,
    }

    ext = file.filename.rsplit(".", 1)[1].lower()
    temp_filename = f"{uuid.uuid4()}.{ext}"
    temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
    file.save(temp_path)

    try:
        result = aai_handler.transcribe_file(temp_path, options)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.route("/api/transcribe/url", methods=["POST"])
def transcribe_url():
    """Transcribe audio from a URL."""
    data = request.get_json()
    if not data or "url" not in data:
        return jsonify({"error": "No URL provided"}), 400

    options = {
        "speaker_labels": data.get("speaker_labels", True),
        "punctuate": True,
        "format_text": True,
    }

    try:
        result = aai_handler.transcribe_url(data["url"], options)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/translate", methods=["POST"])
def translate_text():
    """Translate transcribed text using Gemini."""
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]
    target_language = data.get("target_language", "Hindi")
    source_language = data.get("source_language", "auto")

    try:
        result = gemini_handler.translate(text, target_language, source_language)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/summarize", methods=["POST"])
def summarize_text():
    """Summarize transcribed text using Gemini."""
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]
    style = data.get("style", "concise")  # concise, detailed, bullet_points, executive

    try:
        result = gemini_handler.summarize(text, style)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/enhance", methods=["POST"])
def enhance_text():
    """Enhance/correct transcribed text using Gemini."""
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]
    enhancement_type = data.get("type", "grammar")  # grammar, formal, casual, technical

    try:
        result = gemini_handler.enhance(text, enhancement_type)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/analyze", methods=["POST"])
def analyze_text():
    """Full analysis: sentiment, key topics, action items using Gemini."""
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data["text"]

    try:
        result = gemini_handler.analyze(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/languages", methods=["GET"])
def get_languages():
    """Return supported languages for translation."""
    languages = [
        {"code": "en", "name": "English", "native": "English"},
        {"code": "hi", "name": "Hindi", "native": "हिन्दी"},
        {"code": "es", "name": "Spanish", "native": "Español"},
        {"code": "fr", "name": "French", "native": "Français"},
        {"code": "de", "name": "German", "native": "Deutsch"},
        {"code": "zh", "name": "Chinese (Simplified)", "native": "中文"},
        {"code": "ja", "name": "Japanese", "native": "日本語"},
        {"code": "ko", "name": "Korean", "native": "한국어"},
        {"code": "ar", "name": "Arabic", "native": "العربية"},
        {"code": "pt", "name": "Portuguese", "native": "Português"},
        {"code": "ru", "name": "Russian", "native": "Русский"},
        {"code": "it", "name": "Italian", "native": "Italiano"},
        {"code": "nl", "name": "Dutch", "native": "Nederlands"},
        {"code": "tr", "name": "Turkish", "native": "Türkçe"},
        {"code": "pl", "name": "Polish", "native": "Polski"},
        {"code": "sv", "name": "Swedish", "native": "Svenska"},
        {"code": "ta", "name": "Tamil", "native": "தமிழ்"},
        {"code": "te", "name": "Telugu", "native": "తెలుగు"},
        {"code": "bn", "name": "Bengali", "native": "বাংলা"},
        {"code": "mr", "name": "Marathi", "native": "मराठी"},
        {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી"},
    ]
    return jsonify({"languages": languages})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    print(f"🎙️ VoiceForge AI Backend starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=debug)

