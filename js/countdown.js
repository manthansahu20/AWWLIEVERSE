/* =========================================
   AWWLIEVERSE — Countdown System
   Countdown: 10 to 0
========================================= */

"use strict";

const BirthdayCountdown = (() => {

    let countdownInterval = null;
    let isRunning = false;

    const getElement = (id) => {
        return document.getElementById(id);
    };

    /**
     * Displays the selected section and hides the others.
     * The section must exist in index.html.
     */
    function showSection(sectionId) {
        const sections = document.querySelectorAll("main section");

        sections.forEach((section) => {
            section.hidden = section.id !== sectionId;
            section.classList.remove("animate-in");
        });

        const targetSection = getElement(sectionId);

        if (!targetSection) {
            console.error(
                `AWWLIEVERSE: Section "${sectionId}" was not found.`
            );
            return false;
        }

        targetSection.hidden = false;

        // Restart the entrance animation.
        void targetSection.offsetWidth;

        targetSection.classList.add("animate-in");

        return true;
    }

    /**
     * Starts the countdown from 10 to 0.
     */
    function start() {

        if (isRunning) {
            return;
        }

        const countdownDisplay = getElement("countdown-number");

        if (!countdownDisplay) {
            console.error(
                "AWWLIEVERSE: Countdown display was not found."
            );
            return;
        }

        isRunning = true;

        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
        }

        showSection("countdown-section");

        let count = 10;

        function updateCountdown() {

            countdownDisplay.textContent = count;

            countdownDisplay.classList.remove("countdown-change");

            // Restart the number-change animation.
            void countdownDisplay.offsetWidth;

            countdownDisplay.classList.add("countdown-change");

            if (count === 0) {

                clearInterval(countdownInterval);
                countdownInterval = null;

                // Brief pause before revealing the cake.
                setTimeout(() => {

                    isRunning = false;

                    showSection("cake-section");

                    // Notify the cake script that the cake is visible.
                    document.dispatchEvent(
                        new CustomEvent("awwlie:countdown-complete")
                    );

                }, 1000);

                return;
            }

            count--;
        }

        // Show 10 immediately, then update every second.
        updateCountdown();

        countdownInterval = setInterval(updateCountdown, 1000);
    }

    /**
     * Allows other scripts to start the countdown.
     */
    return {
        start,
        showSection
    };

})();

/* Make the countdown available to the other scripts. */
window.BirthdayCountdown = BirthdayCountdown;
