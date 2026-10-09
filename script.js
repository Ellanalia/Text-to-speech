let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");

// Populate voices with language tags in the dropdown label
window.speechSynthesis.addEventListener("voiceschanged", () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voiceSelect.innerHTML = "";
    voices.forEach((voice, i) => {
        // Show language code alongside the voice name
        voiceSelect.options[i] = new Option(`${voice.name} (${voice.lang})`, i);
    });
});

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Translation helper function
async function translateText(text, targetLang) {
    // Extract base language code (e.g., 'es' from 'es-ES' or 'es-MX')
    const langCode = targetLang.split('-')[0];
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${langCode}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to original text if translation fails
    }
}

document.querySelector("button").addEventListener("click", async () => {
    const rawText = document.querySelector("textarea").value.trim();
    if (!rawText) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const selectedVoice = voices[voiceSelect.value];
    speech.voice = selectedVoice;

    // Translate text to selected voice's language
    const translatedText = await translateText(rawText, selectedVoice.lang);

    speech.text = translatedText;
    window.speechSynthesis.speak(speech);
});