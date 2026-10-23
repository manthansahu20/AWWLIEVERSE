"use strict";

/* =========================================
   AWWLIEVERSE — VOICE MESSAGES
   Three Personal Birthday Recordings
========================================= */

const VoiceMessages = (() => {
    const VOICE_SECTION_ID = "voice-section";

    let initialized = false;

    const getElement = (id) => document.getElementById(id);

    /**
     * Navigate to a section.
     */
    function showSection(sectionId) {
        if (
            window.BirthdayCountdown &&
            typeof window.BirthdayCountdown.showSection === "function"
        ) {
            window.BirthdayCountdown.showSection(sectionId);
        } else {
            console.error(
                "AWWLIEVERSE: Section navigation is not available."
            );
        }
    }

    /**
     * Pause other voice recordings when one starts playing.
     */
    function setupAudioPlayers() {
        const audioPlayers = document.querySelectorAll(
            `#${VOICE_SECTION_ID} audio`
        );

        audioPlayers.forEach((currentAudio) => {
            currentAudio.addEventListener("play", () => {
                audioPlayers.forEach((otherAudio) => {
                    if (otherAudio !== currentAudio) {
                        otherAudio.pause();
                    }
                });
            });

            currentAudio.addEventListener("error", () => {
                const source = currentAudio.querySelector("source");
                const sourcePath = source
                    ? source.getAttribute("src")
                    : currentAudio.getAttribute("src");

                console.warn(
                    "AWWLIEVERSE: Unable to load audio. Check this file path:",
                    sourcePath
                );
            });
        });
    }

    /**
     * Connect navigation buttons.
     */
    function setupNavigation() {
        const navigationButtons = [
            "open-voice-button",
            "open-voice-from-memories-button"
        ];

        navigationButtons.forEach((buttonId) => {
            const button = getElement(buttonId);

            if (button) {
                button.addEventListener("click", () => {
                    showSection(VOICE_SECTION_ID);
                });
            }
        });

        const letterButton = getElement("open-letter-button");

        if (letterButton) {
            letterButton.addEventListener("click", () => {
                showSection("letter-section");
            });
        }
    }

    /**
     * Set up the background music control.
     */
    function setupBackgroundMusic() {
        const music = getElement("background-music");
        const musicButton = getElement("music-toggle");

        if (!music || !musicButton) return;

        musicButton.setAttribute("aria-pressed", "false");
        musicButton.textContent = "♫ Music Off";

        musicButton.addEventListener("click", async () => {
            if (music.paused) {
                try {
                    await music.play();
                    musicButton.textContent = "♫ Music On";
                    musicButton.setAttribute("aria-pressed", "true");
                } catch (error) {
                    console.warn(
                        "AWWLIEVERSE: Background music could not start.",
                        error
                    );

                    musicButton.textContent = "♫ Tap to Play";
                    musicButton.setAttribute("aria-pressed", "false");
                }
            } else {
                music.pause();
                musicButton.textContent = "♫ Music Off";
                musicButton.setAttribute("aria-pressed", "false");
            }
        });

        music.addEventListener("ended", () => {
            musicButton.textContent = "♫ Music Off";
            musicButton.setAttribute("aria-pressed", "false");
        });
    }

    /**
     * Initialize all voice-related features once.
     */
    function init() {
        if (initialized) return;

        initialized = true;

        setupAudioPlayers();
        setupNavigation();
        setupBackgroundMusic();
    }

    return { init };
})();

window.VoiceMessages = VoiceMessages;

// Initialize after the HTML has loaded.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        VoiceMessages.init,
        { once: true }
    );
} else {
    VoiceMessages.init();
}
