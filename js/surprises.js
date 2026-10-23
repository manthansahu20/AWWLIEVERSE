"use strict";

/* =========================================
   AWWLIEVERSE — SURPRISE EFFECTS
   Created with love by Manthan
   ========================================= */

const BirthdaySurprises = (() => {

    let initialized = false;

    // Get an element safely
    function getElement(id) {
        return document.getElementById(id);
    }

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

    // Create a confetti piece
    function createConfetti(container) {

        const piece = document.createElement("span");

        piece.className = "confetti";

        piece.setAttribute("aria-hidden", "true");

        piece.style.left = `${Math.random() * 100}%`;

        piece.style.animationDelay = `${Math.random() * 0.8}s`;

        piece.style.animationDuration =
            `${2 + Math.random() * 3}s`;

        container.appendChild(piece);

        // Remove the element after its animation
        setTimeout(() => {
            piece.remove();
        }, 6000);

    }

    // Celebrate with confetti
    function celebrate() {

        const container = getElement("confetti-container");

        if (!container) return;

        // Prevent excessive confetti from accumulating
        container.replaceChildren();

        for (let i = 0; i < 70; i++) {
            createConfetti(container);
        }

    }

    // Add a small visual celebration to a section
    function celebrateSection(sectionId) {

        showSection(sectionId);
        celebrate();

    }

    // Connect birthday reveal to the candle event
    function setupBirthdayReveal() {

        document.addEventListener(
            "awwlie:candle-blown-out",
            () => {

                celebrateSection("surprise-section");

            }
        );

    }

    // Celebrate when the final surprise opens
    function setupFinalSurprise() {

        document.addEventListener(
            "awwlie:final-surprise-opened",
            () => {

                celebrate();

            }
        );

    }

    // Initialize event listeners
    function init() {

        if (initialized) return;

        initialized = true;

        setupBirthdayReveal();
        setupFinalSurprise();

    }

    return {
        init,
        celebrate,
        celebrateSection
    };

})();

window.BirthdaySurprises = BirthdaySurprises;


// Initialize after the HTML has loaded
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        BirthdaySurprises.init,
        { once: true }
    );

} else {

    BirthdaySurprises.init();

}
