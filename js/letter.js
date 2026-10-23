"use strict";

/* =========================================
   AWWLIEVERSE — SURPRISE LETTER
   Created with love by Manthan
   ========================================= */

const SurpriseLetter = (() => {

    let initialized = false;
    let letterOpened = false;

    const elements = {
        openButton: null,
        letter: null,
        finalButton: null
    };

    // Open a section using the shared navigation function
    function showSection(sectionId) {

        if (
            window.BirthdayCountdown &&
            typeof window.BirthdayCountdown.showSection === "function"
        ) {
            window.BirthdayCountdown.showSection(sectionId);
        } else {
            console.error(
                "AWWLIEVERSE: Section navigation is unavailable."
            );
        }
    }

    // Reveal the surprise letter
    function openLetter() {

        if (letterOpened) return;

        if (!elements.letter || !elements.openButton) {
            console.error(
                "AWWLIEVERSE: Letter elements were not found."
            );
            return;
        }

        letterOpened = true;

        // Show the letter
        elements.letter.hidden = false;
        elements.letter.classList.add("letter-reveal");

        // Update the envelope button
        elements.openButton.innerHTML =
            '<span aria-hidden="true">💌</span>' +
            '<span>Your letter is open</span>';

        elements.openButton.setAttribute(
            "aria-expanded",
            "true"
        );

        // Reveal the final surprise button
        if (elements.finalButton) {
            elements.finalButton.hidden = false;
        }

        // Bring the letter into view
        setTimeout(() => {
            elements.letter.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            elements.letter.focus({
                preventScroll: true
            });
        }, 150);

        // Notify other JavaScript files
        document.dispatchEvent(
            new CustomEvent("awwlie:letter-opened")
        );

    }

    // Connect the final surprise button
    function setupFinalButton() {

        if (!elements.finalButton) return;

        elements.finalButton.addEventListener("click", () => {
            showSection("final-section");

            document.dispatchEvent(
                new CustomEvent("awwlie:final-surprise-opened")
            );
        });

    }

    // Initialize all letter interactions
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

        if (elements.openButton) {
            elements.openButton.addEventListener(
                "click",
                openLetter
            );
        }

        setupFinalButton();

    }

    return {
        init,
        openLetter
    };

})();

window.SurpriseLetter = SurpriseLetter;


// Initialize after the HTML has loaded
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        SurpriseLetter.init,
        { once: true }
    );

} else {

    SurpriseLetter.init();

}
