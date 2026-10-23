"use strict";

/* =========================================
   AWWLIEVERSE — SURPRISE LETTER
   A special birthday letter for Awwlie
========================================= */

const SurpriseLetter = (() => {
    let initialized = false;
    let letterOpened = false;
    let finalButtonHandled = false;

    const elements = {
        openButton: null,
        letter: null,
        finalButton: null
    };

    /**
     * Navigate to a section using the shared navigation system.
     */
    function showSection(sectionId) {
        if (
            window.BirthdayCountdown &&
            typeof window.BirthdayCountdown.showSection === "function"
        ) {
            return window.BirthdayCountdown.showSection(sectionId);
        }

        console.error(
            "AWWLIEVERSE: Section navigation is unavailable."
        );

        return false;
    }

    /**
     * Reveal the surprise letter.
     */
    function openLetter() {
        if (letterOpened) return;

        if (!elements.letter || !elements.openButton) {
            console.error(
                "AWWLIEVERSE: Letter elements were not found."
            );
            return;
        }

        letterOpened = true;

        elements.letter.hidden = false;
        elements.letter.classList.remove("letter-reveal");

        // Restart the letter entrance animation.
        void elements.letter.offsetWidth;
        elements.letter.classList.add("letter-reveal");

        elements.openButton.innerHTML =
            '<span aria-hidden="true">💌</span> ' +
            '<span>Your letter is open</span>';

        elements.openButton.setAttribute("aria-expanded", "true");
        elements.openButton.disabled = true;

        if (elements.finalButton) {
            elements.finalButton.hidden = false;
        }

        // Bring the letter into view after the reveal.
        window.setTimeout(() => {
            elements.letter.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "center"
            });
        }, 150);

        document.dispatchEvent(
            new CustomEvent("awwlie:letter-opened")
        );
    }

    /**
     * Open the final surprise.
     */
    function openFinalSurprise() {
        if (finalButtonHandled) return;

        if (!letterOpened) {
            openLetter();
            return;
        }

        finalButtonHandled = true;

        const opened = showSection("final-section");

        if (!opened) {
            finalButtonHandled = false;
            return;
        }

        document.dispatchEvent(
            new CustomEvent("awwlie:final-surprise-opened")
        );
    }

    /**
     * Connect the page buttons.
     */
    function setupButtons() {
        if (elements.openButton) {
            elements.openButton.setAttribute("aria-expanded", "false");
            elements.openButton.addEventListener("click", openLetter);
        }

        if (elements.finalButton) {
            elements.finalButton.hidden = true;
            elements.finalButton.addEventListener(
                "click",
                openFinalSurprise
            );
        }
    }

    /**
     * Initialize the letter system once.
     */
    function init() {
        if (initialized) return;

        initialized = true;

        elements.openButton = document.getElementById(
            "open-envelope-button"
        );

        elements.letter = document.getElementById(
            "surprise-letter"
        );

        elements.finalButton = document.getElementById(
            "final-surprise-button"
        );

        if (elements.letter) {
            elements.letter.hidden = true;
            elements.letter.setAttribute("tabindex", "-1");
        }

        setupButtons();
    }

    return {
        init,
        openLetter
    };
})();

window.SurpriseLetter = SurpriseLetter;

// Initialize when the HTML is ready.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        SurpriseLetter.init,
        { once: true }
    );
} else {
    SurpriseLetter.init();
}
