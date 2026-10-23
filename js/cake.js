/* =========================================
   AWWLIEVERSE — Birthday Cake Interaction
   Automatic Candle Blowout
========================================= */

"use strict";

const BirthdayCake = (() => {
    const CANDLE_DURATION = 5000;
    const FLAME_ANIMATION_DURATION = 450;

    let candleTimer = null;
    let animationFrame = null;
    let flameHideTimer = null;
    let cakeStarted = false;
    let candleBlownOut = false;

    const getElement = (id) => document.getElementById(id);

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

        // Prevent duplicate countdowns and timers.
        if (cakeStarted) return;

        cakeStarted = true;
        candleBlownOut = false;

        if (candleTimer !== null) {
            clearTimeout(candleTimer);
            candleTimer = null;
        }

        if (flameHideTimer !== null) {
            clearTimeout(flameHideTimer);
            flameHideTimer = null;
        }

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        flame.classList.remove("blown-out");
        flame.hidden = false;

        if (message) {
            message.textContent =
                "Awwlie, make a wish! Your candle is waiting for you. ✨";
        }

        if (timerDisplay) {
            timerDisplay.textContent = "Make your wish... 5";
        }

        const startTime = Date.now();

        // Automatically extinguish the candle after five seconds.
        candleTimer = setTimeout(() => {
            blowOutCandle();
        }, CANDLE_DURATION);

        // Update the visible countdown without creating an interval.
        if (timerDisplay) {
            function updateTimer() {
                if (candleBlownOut) {
                    animationFrame = null;
                    return;
                }

                const elapsed = Date.now() - startTime;
                const remaining = Math.max(
                    0,
                    Math.ceil((CANDLE_DURATION - elapsed) / 1000)
                );

                timerDisplay.textContent = remaining > 0
                    ? `Make your wish... ${remaining}`
                    : "Your wish is on its way! ✨";

                if (remaining > 0) {
                    animationFrame = requestAnimationFrame(updateTimer);
                } else {
                    animationFrame = null;
                }
            }

            animationFrame = requestAnimationFrame(updateTimer);
        }
    }

    /**
     * Extinguishes the candle and notifies the website.
     */
    function blowOutCandle() {
        if (candleBlownOut) return;

        candleBlownOut = true;

        if (candleTimer !== null) {
            clearTimeout(candleTimer);
            candleTimer = null;
        }

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        const flame = getElement("candle-flame");
        const message = getElement("cake-message");
        const timerDisplay = getElement("cake-timer");

        if (flame) {
            flame.classList.add("blown-out");

            flameHideTimer = setTimeout(() => {
                flame.hidden = true;
                flameHideTimer = null;
            }, FLAME_ANIMATION_DURATION);
        }

        if (message) {
            message.textContent =
                "Happy Birthday, Awwlie! May your wishes come true. 💖";
        }

        if (timerDisplay) {
            timerDisplay.textContent =
                "Wish made. A little birthday magic begins! ✨";
        }

        document.dispatchEvent(
            new CustomEvent("awwlie:candle-blown-out")
        );
    }

    /**
     * Resets the cake experience.
     */
    function reset() {
        if (candleTimer !== null) {
            clearTimeout(candleTimer);
            candleTimer = null;
        }

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        if (flameHideTimer !== null) {
            clearTimeout(flameHideTimer);
            flameHideTimer = null;
        }

        cakeStarted = false;
        candleBlownOut = false;

        const flame = getElement("candle-flame");
        const message = getElement("cake-message");
        const timerDisplay = getElement("cake-timer");

        if (flame) {
            flame.classList.remove("blown-out");
            flame.hidden = false;
        }

        if (message) {
            message.textContent = "";
        }

        if (timerDisplay) {
            timerDisplay.textContent = "";
        }
    }

    return {
        start,
        blowOutCandle,
        reset
    };
})();

// Make the cake system available to other scripts.
window.BirthdayCake = BirthdayCake;

// Start the candle experience when the countdown finishes.
document.addEventListener("awwlie:countdown-complete", () => {
    BirthdayCake.start();
});
