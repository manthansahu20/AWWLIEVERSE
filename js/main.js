"use strict";

/* =========================================
   AWWLIEVERSE — MAIN CONTROLLER
   Created with love by Manthan
   ========================================= */

const Awwlieverse = (() => {

    let initialized = false;
    let experienceStarted = false;

    // Find an HTML element by ID
    function getElement(id) {
        return document.getElementById(id);
    }

    // Start the birthday experience
    function startExperience() {

        if (experienceStarted) return;

        const startButton = getElement("start-button");

        // Check whether the countdown module exists
        if (
            !window.BirthdayCountdown ||
            typeof window.BirthdayCountdown.start !== "function"
        ) {
            console.error(
                "AWWLIEVERSE: Countdown script could not be found."
            );

            if (startButton) {
                startButton.disabled = false;
                startButton.textContent = "Open Your Universe ✨";
            }

            return;
        }

        experienceStarted = true;

        if (startButton) {
            startButton.disabled = true;
            startButton.textContent = "Your universe is opening... ✨";
        }

        window.BirthdayCountdown.start();
    }

    // Initialize a module safely
    function initializeModule(moduleName) {

        const module = window[moduleName];

        if (module && typeof module.init === "function") {
            module.init();
        } else {
            console.warn(
                `AWWLIEVERSE: ${moduleName} is unavailable.`
            );
        }
    }

    // Initialize all sections with their animation class
    function setupSectionAnimations() {

        const sections = document.querySelectorAll(
            "#birthday-app section"
        );

        sections.forEach((section) => {

            // Hidden sections will animate when shown by the
            // shared section navigation function.
            if (!section.hidden) {
                section.classList.add("animate-in");
            }

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

        startButton.addEventListener("click", startExperience);
    }

    // Initialize the main controller
    function init() {

        if (initialized) return;

        initialized = true;

        setupStartButton();
        setupSectionAnimations();

        // Initialize modules used by the website.
        // Each module has its own initialization guard.
        initializeModule("VoiceMessages");
        initializeModule("SurpriseLetter");
        initializeModule("BirthdaySurprises");

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
