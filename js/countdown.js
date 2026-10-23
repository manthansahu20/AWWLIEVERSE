/* =========================================
   AWWLIEVERSE — Countdown System
   Countdown: 10 to 0
========================================= */

"use strict";

const BirthdayCountdown = (() => {
    let countdownInterval = null;
    let transitionTimeout = null;
    let isRunning = false;

    const getElement = (id) => document.getElementById(id);

    /**
     * Shows one section and hides all other main sections.
     */
    function showSection(sectionId) {
        const targetSection = getElement(sectionId);

        if (!targetSection) {
            console.error(
                `AWWLIEVERSE: Section "${sectionId}" was not found.`
            );
            return false;
        }

        const sections = document.querySelectorAll("main section");

        sections.forEach((section) => {
            section.hidden = section !== targetSection;
            section.classList.remove("animate-in");
        });

        // Restart the section entrance animation.
        void targetSection.offsetWidth;
        targetSection.classList.add("animate-in");

        return true;
    }

    /**
     * Clears countdown timers if necessary.
     */
    function clearTimers() {
        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        if (transitionTimeout !== null) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }
    }

    /**
     * Starts the countdown from 10 to 0.
     */
    function start() {
        if (isRunning) return;

        const countdownDisplay = getElement("countdown-number");

        if (!countdownDisplay) {
            console.error(
                "AWWLIEVERSE: Countdown display was not found."
            );
            return;
        }

        if (!showSection("countdown-section")) return;

        clearTimers();
        isRunning = true;

        let count = 10;

        function updateCountdown() {
            countdownDisplay.textContent = String(count);

            countdownDisplay.classList.remove("countdown-change");

            // Restart the number animation.
            void countdownDisplay.offsetWidth;
            countdownDisplay.classList.add("countdown-change");

            if (count === 0) {
                if (countdownInterval !== null) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }

                transitionTimeout = setTimeout(() => {
                    transitionTimeout = null;
                    isRunning = false;

                    if (!showSection("cake-section")) return;

                    // Notify cake.js that the cake section is visible.
                    document.dispatchEvent(
                        new CustomEvent("awwlie:countdown-complete")
                    );
                }, 1000);

                return;
            }

            count -= 1;
        }

        // Display 10 immediately, then update every second.
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    return {
        start,
        showSection
    };
})();

// Make the countdown available to other scripts.
window.BirthdayCountdown = BirthdayCountdown;
