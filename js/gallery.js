/* =========================================
   AWWLIEVERSE — Memories Gallery
   Our Little Universe
========================================= */

"use strict";

const MemoriesGallery = (() => {

    const photos = [
        {
            src: "assets/images/photo-01.jpg",
            alt: "A special memory of Manthan and Awwlie",
            caption: "One little moment, a thousand memories. 💗"
        },
        {
            src: "assets/images/photo-02.jpg",
            alt: "A beautiful friendship memory",
            caption: "Some memories deserve their own universe. ✨"
        },
        {
            src: "assets/images/photo-03.jpg",
            alt: "Another memory of our friendship",
            caption: "My favourite person, my forever friend. 🌙"
        }
    ];

    const gallery = document.getElementById("gallery-grid");

    /**
     * Creates a photo card.
     */
    function createPhotoCard(photo, index) {

        const card = document.createElement("article");
        card.className = "photo-card";

        const image = document.createElement("img");

        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = "lazy";
        image.decoding = "async";

        const caption = document.createElement("p");
        caption.className = "photo-caption";
        caption.textContent = photo.caption;

        // Display a friendly message if an image is unavailable.
        image.addEventListener("error", () => {

            image.alt = "Photo unavailable";

            card.classList.add("photo-unavailable");

            if (!card.querySelector(".photo-error")) {

                const errorMessage = document.createElement("p");

                errorMessage.className = "photo-error";
                errorMessage.textContent =
                    "Add your photo here: photo-" +
                    String(index + 1).padStart(2, "0") +
                    ".jpg";

                card.appendChild(errorMessage);
            }

        });

        card.appendChild(image);
        card.appendChild(caption);

        return card;
    }

    /**
     * Loads the memories into the gallery.
     */
    function render() {

        if (!gallery) {
            console.warn(
                'AWWLIEVERSE: Add an element with id="gallery-grid" ' +
                "inside the gallery section."
            );
            return;
        }

        gallery.replaceChildren();

        photos.forEach((photo, index) => {
            gallery.appendChild(
                createPhotoCard(photo, index)
            );
        });
    }

    /**
     * Opens the memories section.
     */
    function open() {

        if (window.BirthdayCountdown) {
            window.BirthdayCountdown.showSection("gallery-section");
        }

        render();
    }

    /**
     * Returns a copy of the current photo information.
     */
    function getPhotos() {
        return photos.map((photo) => ({ ...photo }));
    }

    return {
        render,
        open,
        getPhotos
    };

})();

window.MemoriesGallery = MemoriesGallery;

/*
 * Render the gallery when the page is ready.
 */
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        MemoriesGallery.render,
        { once: true }
    );

} else {

    MemoriesGallery.render();

}

/*
 * Open the gallery when the user clicks the memories button.
 */
document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById(
        "open-memories-button"
    );

    if (button) {
        button.addEventListener("click", () => {
            MemoriesGallery.open();
        });
    }

});
