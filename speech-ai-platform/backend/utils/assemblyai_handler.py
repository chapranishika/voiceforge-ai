import assemblyai as aai


class AssemblyAIHandler:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("ASSEMBLYAI_API_KEY missing")
        try:
            aai.settings.api_key = api_key
        except Exception:
            import os
            os.environ["ASSEMBLYAI_API_KEY"] = api_key

    def transcribe_file(self, file_path: str, options: dict = None) -> dict:
        config = self._build_config(options or {})
        transcript = aai.Transcriber().transcribe(file_path, config=config)
        if transcript.status == aai.TranscriptStatus.error:
            raise Exception(f"Transcription failed: {transcript.error}")
        return self._format_result(transcript)

    def transcribe_url(self, url: str, options: dict = None) -> dict:
        config = self._build_config(options or {})
        transcript = aai.Transcriber().transcribe(url, config=config)
        if transcript.status == aai.TranscriptStatus.error:
            raise Exception(f"Transcription failed: {transcript.error}")
        return self._format_result(transcript)

    def _build_config(self, options: dict) -> aai.TranscriptionConfig:
        return aai.TranscriptionConfig(
            speech_models=["universal-2"],
            speaker_labels=options.get("speaker_labels", True),
            punctuate=options.get("punctuate", True),
            format_text=options.get("format_text", True),
            auto_chapters=options.get("auto_chapters", False),
            sentiment_analysis=options.get("sentiment_analysis", False),
            entity_detection=options.get("entity_detection", False),
        )

    def _format_result(self, transcript) -> dict:
        result = {
            "id": transcript.id,
            "status": transcript.status.value,
            "text": transcript.text or "",
            "confidence": transcript.confidence,
            "audio_duration": transcript.audio_duration,
            "language_code": getattr(transcript, "language_code", None),
            "words": [],
            "utterances": [],
            "chapters": [],
            "sentiment_results": [],
            "entities": [],
        }
        if transcript.words:
            result["words"] = [
                {"text": w.text, "start": w.start, "end": w.end, "confidence": w.confidence, "speaker": getattr(w, "speaker", None)}
                for w in transcript.words
            ]
        if transcript.utterances:
            result["utterances"] = [
                {"speaker": u.speaker, "text": u.text, "start": u.start, "end": u.end, "confidence": u.confidence,
                 "words": [{"text": w.text, "start": w.start, "end": w.end, "confidence": w.confidence} for w in u.words]}
                for u in transcript.utterances
            ]
        if transcript.chapters:
            result["chapters"] = [
                {"summary": c.summary, "headline": c.headline, "gist": c.gist, "start": c.start, "end": c.end}
                for c in transcript.chapters
            ]
        if hasattr(transcript, "sentiment_analysis") and transcript.sentiment_analysis:
            result["sentiment_results"] = [
                {"text": s.text, "sentiment": s.sentiment.value, "confidence": s.confidence, "start": s.start, "end": s.end}
                for s in transcript.sentiment_analysis
            ]
        if transcript.entities:
            result["entities"] = [
                {"text": e.text, "entity_type": e.entity_type.value, "start": e.start, "end": e.end}
                for e in transcript.entities
            ]
        return result



