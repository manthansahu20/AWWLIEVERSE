"use strict";

/* =========================================
   AWWLIEVERSE — MAIN CONTROLLER
   Created with love by Manthan
   ========================================= */

const Awwlieverse = (() => {

    let initialized = false;

    // Find an HTML element by ID
    function getElement(id) {
        return document.getElementById(id);
    }

    // Start the birthday experience
    function startExperience() {

        const startButton = getElement("start-button");

        if (startButton) {
            startButton.disabled = true;
            startButton.textContent = "Your universe is opening... ✨";
        }

        // Start the countdown
        if (
            window.BirthdayCountdown &&
            typeof window.BirthdayCountdown.start === "function"
        ) {

            window.BirthdayCountdown.start();

        } else {

            console.error(
                "AWWLIEVERSE: Countdown script could not be found."
            );

            if (startButton) {
                startButton.disabled = false;
                startButton.textContent = "Open Your Universe ✨";
            }

        }

    }

    // Add a gentle animation when a section opens
    function setupSectionAnimations() {

        const sections = document.querySelectorAll(
            "#birthday-app section"
        );

        sections.forEach((section) => {

            section.addEventListener("transitionend", () => {

                if (!section.hidden) {
                    section.classList.add("animate-in");
                }

            });

        });

    }

    // Connect the introduction button
    function setupStartButton() {

        const startButton = getElement("start-button");

        if (!startButton) {
            console.error(
                'AWWLIEVERSE: Could not find "#start-button".'
            );
            return;
        }

        startButton.addEventListener(
            "click",
            startExperience
        );

    }

    // Initialize the main controller
    function init() {

        if (initialized) return;

        initialized = true;

        setupStartButton();
        setupSectionAnimations();

        // Initialize the other modules safely
        if (window.VoiceMessages) {
            window.VoiceMessages.init();
        }

        if (window.SurpriseLetter) {
            window.SurpriseLetter.init();
        }

        if (window.BirthdaySurprises) {
            window.BirthdaySurprises.init();
        }

        console.log(
            "🌙 AWWLIEVERSE initialized successfully!"
        );

    }

    return {
        init,
        startExperience
    };

})();

window.Awwlieverse = Awwlieverse;


// Initialize when the HTML is ready
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        Awwlieverse.init,
        { once: true }
    );

} else {

    Awwlieverse.init();

}
