import google.generativeai as genai


class GeminiHandler:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("GEMINI_API_KEY missing")

        # ✅ correct setup
        genai.configure(api_key=api_key)

        # try multiple working models
        self.models = [
            "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro-latest"
        ]

    # ========= TRANSLATE =========
    def translate(self, text, target_language, source_language="auto"):
        prompt = f"""
Detect the language automatically and translate to {target_language}.

Return ONLY translated text.

{text}
"""
        return self._run(prompt, "translated_text")

    # ========= SUMMARIZE =========
    def summarize(self, text, style="concise"):
        styles = {
            "concise": "Summarize in 2-3 sentences.",
            "detailed": "Write a detailed paragraph summary.",
            "bullet_points": "Give bullet points.",
            "executive": "Give executive summary.",
        }

        instruction = styles.get(style, styles["concise"])
        prompt = f"{instruction}\n\n{text}"

        return self._run(prompt, "summary")

    # ========= ENHANCE =========
    def enhance(self, text, enhancement_type="grammar"):
        instructions = {
            "grammar": "Fix grammar and clarity.",
            "formal": "Rewrite in formal tone.",
            "casual": "Rewrite in casual tone.",
            "technical": "Rewrite in technical tone.",
        }

        instruction = instructions.get(enhancement_type, instructions["grammar"])
        prompt = f"{instruction}\n\n{text}"

        return self._run(prompt, "enhanced_text")

    # ========= ANALYZE =========
    def analyze(self, text):
        prompt = f"""
Analyze sentiment (positive/negative/neutral):

{text}
"""
        return self._run(prompt, "sentiment")

    # ========= CORE =========
    def _run(self, prompt, key):
        for model_name in self.models:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)

                output = ""

                if response.text:
                    output = response.text.strip()

                if output:
                    print(f"✅ Gemini success with: {model_name}")
                    return {key: output}

            except Exception as e:
                err = str(e)

                # skip quota / model errors
                if "429" in err or "quota" in err.lower() or "404" in err.lower():
                    print(f"⚠️ Skipping {model_name}: {err[:80]}")
                    continue

                print(f"❌ Gemini ERROR ({model_name}): {err}")
                return {key: "⚠️ AI error occurred"}

        return {key: "⚠️ All Gemini models exhausted. Try again later."}
