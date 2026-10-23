"use strict";

/* =========================================
   AWWLIEVERSE — SURPRISE EFFECTS
   Created with love by Manthan
   ========================================= */

const BirthdaySurprises = (() => {

    let initialized = false;
    let birthdayCelebrated = false;
    let finalCelebrated = false;

    let confettiTimeouts = [];

    // Get an element safely
    function getElement(id) {
        return document.getElementById(id);
    }

    // Navigate using the shared section controller
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

    // Clear previously scheduled confetti cleanup
    function clearConfettiTimers() {
        confettiTimeouts.forEach((timeout) => clearTimeout(timeout));
        confettiTimeouts = [];
    }

    // Create one confetti piece
    function createConfetti(container) {
        const piece = document.createElement("span");

        piece.className = "confetti";
        piece.setAttribute("aria-hidden", "true");

        piece.style.left = `${Math.random() * 100}%`;
        piece.style.animationDelay = `${Math.random() * 0.8}s`;
        piece.style.animationDuration = `${2 + Math.random() * 3}s`;

        container.appendChild(piece);

        const timeout = setTimeout(() => {
            piece.remove();
        }, 6500);

        confettiTimeouts.push(timeout);
    }

    // Create a confetti celebration
    function celebrate() {
        const container = getElement("confetti-container");

        if (!container) {
            console.warn(
                "AWWLIEVERSE: Confetti container was not found."
            );
            return;
        }

        clearConfettiTimers();
        container.replaceChildren();

        for (let i = 0; i < 70; i++) {
            createConfetti(container);
        }
    }

    // Navigate to a section and celebrate
    function celebrateSection(sectionId) {
        showSection(sectionId);
        celebrate();
    }

    // Show birthday reveal after the candle goes out
    function setupBirthdayReveal() {
        document.addEventListener(
            "awwlie:candle-blown-out",
            () => {
                if (birthdayCelebrated) return;

                birthdayCelebrated = true;
                celebrateSection("surprise-section");
            }
        );
    }

    // Celebrate when the final surprise opens
    function setupFinalSurprise() {
        document.addEventListener(
            "awwlie:final-surprise-opened",
            () => {
                if (finalCelebrated) return;

                finalCelebrated = true;
                celebrate();
            }
        );
    }

    // Initialize event listeners once
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

// Initialize after HTML loads
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        BirthdaySurprises.init,
        { once: true }
    );
} else {
    BirthdaySurprises.init();
}
