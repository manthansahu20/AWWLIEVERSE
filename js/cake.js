/* =========================================
   AWWLIEVERSE — Birthday Cake Interaction
   Automatic Candle Blowout
========================================= */

"use strict";

const BirthdayCake = (() => {

    const CANDLE_DURATION = 5000;

    let candleTimer = null;
    let cakeStarted = false;
    let candleBlownOut = false;

    const getElement = (id) => {
        return document.getElementById(id);
    };

    /**
     * Starts the birthday cake experience.
     */
    function start() {

        const flame = getElement("candle-flame");
        const message = getElement("cake-message");
        const timerDisplay = getElement("cake-timer");

        if (!flame) {
            console.error(
                "AWWLIEVERSE: Candle flame element was not found."
            );
            return;
        }

        // Prevent duplicate timers.
        if (cakeStarted) {
            return;
        }

        cakeStarted = true;
        candleBlownOut = false;

        flame.classList.remove("blown-out");
        flame.hidden = false;

        if (message) {
            message.textContent =
                "Awwlie, make a wish! Your candle is waiting for you. ✨";
        }

        if (timerDisplay) {
            timerDisplay.textContent =
                "Make your wish... 💖";
        }

        // Start the five-second candle timer.
        const startTime = Date.now();

        candleTimer = setTimeout(() => {
            blowOutCandle();
        }, CANDLE_DURATION);

        // Optional visible countdown.
        if (timerDisplay) {

            function updateTimer() {

                if (candleBlownOut) {
                    return;
                }

                const elapsed = Date.now() - startTime;

                const remaining = Math.max(
                    0,
                    Math.ceil((CANDLE_DURATION - elapsed) / 1000)
                );

                timerDisplay.textContent =
                    remaining > 0
                        ? `Make your wish... ${remaining}`
                        : "Your wish is on its way! ✨";

                if (remaining > 0) {
                    requestAnimationFrame(updateTimer);
                }
            }

            requestAnimationFrame(updateTimer);
        }
    }

    /**
     * Extinguishes the candle flame.
     */
    function blowOutCandle() {

        if (candleBlownOut) {
            return;
        }

        candleBlownOut = true;

        if (candleTimer !== null) {
            clearTimeout(candleTimer);
            candleTimer = null;
        }

        const flame = getElement("candle-flame");
        const message = getElement("cake-message");
        const timerDisplay = getElement("cake-timer");

        if (flame) {
            flame.classList.add("blown-out");

            // Hide the flame after its extinguishing animation.
            setTimeout(() => {
                flame.hidden = true;
            }, 450);
        }

        if (message) {
            message.textContent =
                "Happy Birthday, Awwlie! May your wishes come true. 💖";
        }

        if (timerDisplay) {
            timerDisplay.textContent =
                "Wish made. A little birthday magic begins! ✨";
        }

        // Notify the rest of the website.
        document.dispatchEvent(
            new CustomEvent("awwlie:candle-blown-out")
        );
    }

    /**
     * Resets the cake experience if needed.
     */
    function reset() {

        if (candleTimer !== null) {
            clearTimeout(candleTimer);
            candleTimer = null;
        }

        cakeStarted = false;
        candleBlownOut = false;

        const flame = getElement("candle-flame");

        if (flame) {
            flame.classList.remove("blown-out");
            flame.hidden = false;
        }
    }

    return {
        start,
        blowOutCandle,
        reset
    };

})();

/* Make the cake system available to other scripts. */
window.BirthdayCake = BirthdayCake;

/*
 * Start the candle experience when the countdown finishes.
 */
document.addEventListener(
    "awwlie:countdown-complete",
    () => {
        BirthdayCake.start();
    }
);
