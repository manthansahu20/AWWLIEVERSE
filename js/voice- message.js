"use strict";

/* =========================================
   AWWLIEVERSE — VOICE MESSAGES
   ========================================= */

const VoiceMessages = (() => {

    const voiceSectionId = "voice-section";
    const galleryButtonId = "open-voice-button";
    const letterButtonId = "open-letter-button";

    let initialized = false;

    // Open a section using the shared navigation function
    function showSection(sectionId) {

        if (window.BirthdayCountdown &&
            typeof window.BirthdayCountdown.showSection === "function") {

            window.BirthdayCountdown.showSection(sectionId);

        } else {

            console.error(
                "AWWLIEVERSE: Section navigation is not available."
            );

        }
    }

    // Pause other recordings when one starts playing
    function setupAudioPlayers() {

        const audioPlayers = document.querySelectorAll(
            "#voice-section audio"
        );

        audioPlayers.forEach((currentAudio) => {

            currentAudio.addEventListener("play", () => {

                audioPlayers.forEach((otherAudio) => {

                    if (otherAudio !== currentAudio) {
                        otherAudio.pause();
                    }

                });

            });

            // Display a useful error if a recording cannot load
            currentAudio.addEventListener("error", () => {

                console.warn(
                    "AWWLIEVERSE: Check the audio file path:",
                    currentAudio.querySelector("source")?.getAttribute("src")
                );

            });

        });

    }

    // Connect navigation buttons
    function setupNavigation() {

        const galleryButton = document.getElementById(
            galleryButtonId
        );

        const letterButton = document.getElementById(
            letterButtonId
        );

        if (galleryButton) {

            galleryButton.addEventListener("click", () => {
                showSection(voiceSectionId);
            });

        }

        if (letterButton) {

            letterButton.addEventListener("click", () => {
                showSection("letter-section");
            });

        }

    }

    // Initialize once
    function init() {

        if (initialized) return;

        initialized = true;

        setupAudioPlayers();
        setupNavigation();

    }

    return {
        init
    };

})();

window.VoiceMessages = VoiceMessages;

// Initialize after the HTML has loaded
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        VoiceMessages.init,
        { once: true }
    );

} else {

    VoiceMessages.init();

}
