/* =========================================
   AWWLIEVERSE — Memories Gallery
   9 Main Photos + 10 Memory Photos
========================================= */

"use strict";

const MemoriesGallery = (() => {
    const mainPhotos = Array.from({ length: 9 }, (_, index) => {
        const number = String(index + 1).padStart(2, "0");

        return {
            src: `assets/images/photo-${number}.jpg`,
            alt: `Friendship photo ${index + 1}`,
            caption: [
                "One little moment, a thousand memories. 💗",
                "Some memories deserve their own universe. ✨",
                "My favourite person, my forever friend. 🌙",
                "Little moments, endless happiness. 💜",
                "A memory that always makes me smile. 🌸",
                "Together, making ordinary days special. 🦋",
                "A friendship worth keeping forever. 💖",
                "Our little world, our beautiful memories. 🌷",
                "Some bonds are simply irreplaceable. 🌙"
            ][index]
        };
    });

    const memoryPhotos = Array.from({ length: 10 }, (_, index) => {
        const number = String(index + 1).padStart(2, "0");

        return {
            src: `assets/images/memories/memory-${number}.jpg`,
            alt: `Special memory ${index + 1}`,
            caption: `Memory ${index + 1}`
        };
    });

    const getElement = (id) => document.getElementById(id);

    let viewerPhotos = [];
    let viewerIndex = 0;

    /**
     * Create an accessible photo card.
     */
    function createPhotoCard(photo, index, photoList) {
        const card = document.createElement("article");
        card.className = "photo-card";

        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.className = "photo-open-button";
        openButton.setAttribute(
            "aria-label",
            `Open ${photo.alt}`
        );

        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = "lazy";
        image.decoding = "async";

        image.addEventListener("error", () => {
            card.classList.add("photo-unavailable");

            let errorMessage = card.querySelector(".photo-error");

            if (!errorMessage) {
                errorMessage = document.createElement("p");
                errorMessage.className = "photo-error";
                errorMessage.textContent = "Photo could not be loaded.";
                card.appendChild(errorMessage);
            }

            openButton.disabled = true;
        });

        openButton.appendChild(image);

        openButton.addEventListener("click", () => {
            openViewer(photoList, index);
        });

        const caption = document.createElement("p");
        caption.className = "photo-caption";
        caption.textContent = photo.caption;

        card.append(openButton, caption);

        return card;
    }

    /**
     * Render a photo list into a gallery container.
     */
    function renderInto(containerId, photoList) {
        const container = getElement(containerId);

        if (!container) {
            console.warn(
                `AWWLIEVERSE: Gallery container "${containerId}" was not found.`
            );
            return;
        }

        container.replaceChildren();

        photoList.forEach((photo, index) => {
            container.appendChild(
                createPhotoCard(photo, index, photoList)
            );
        });
    }

    /**
     * Render the main gallery and memory gallery.
     */
    function render() {
        renderInto("gallery-grid", mainPhotos);
        renderInto("memory-gallery-grid", memoryPhotos);
    }

    /**
     * Open a photo in the large photo viewer.
     */
    function openViewer(photoList, index) {
        const dialog = getElement("photo-viewer");
        const viewerImage = getElement("viewer-image");
        const viewerCaption = getElement("viewer-caption");

        if (!dialog || !viewerImage) {
            console.warn(
                "AWWLIEVERSE: Photo viewer elements were not found."
            );
            return;
        }

        viewerPhotos = photoList;
        viewerIndex = index;

        displayViewerPhoto();

        if (typeof dialog.showModal === "function") {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            dialog.setAttribute("open", "");
        }
    }

    /**
     * Display the currently selected photo.
     */
    function displayViewerPhoto() {
        const viewerImage = getElement("viewer-image");
        const viewerCaption = getElement("viewer-caption");

        if (!viewerImage || !viewerPhotos.length) return;

        const photo = viewerPhotos[viewerIndex];

        viewerImage.src = photo.src;
        viewerImage.alt = photo.alt;

        if (viewerCaption) {
            viewerCaption.textContent =
                `${photo.caption} (${viewerIndex + 1} of ${viewerPhotos.length})`;
        }
    }

    /**
     * Close the photo viewer.
     */
    function closeViewer() {
        const dialog = getElement("photo-viewer");

        if (!dialog) return;

        if (typeof dialog.close === "function" && dialog.open) {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
        }
    }

    /**
     * Navigate between photos in the viewer.
     */
    function changePhoto(direction) {
        if (!viewerPhotos.length) return;

        viewerIndex =
            (viewerIndex + direction + viewerPhotos.length) %
            viewerPhotos.length;

        displayViewerPhoto();
    }

    /**
     * Open the main photo gallery.
     */
    function open() {
        renderInto("gallery-grid", mainPhotos);

        if (window.BirthdayCountdown) {
            window.BirthdayCountdown.showSection("gallery-section");
        }
    }

    /**
     * Open the separate memories gallery.
     */
    function openMemories() {
        renderInto("memory-gallery-grid", memoryPhotos);

        if (window.BirthdayCountdown) {
            window.BirthdayCountdown.showSection("memory-gallery-section");
        }
    }

    /**
     * Return copies of the photo information.
     */
    function getPhotos() {
        return mainPhotos.map((photo) => ({ ...photo }));
    }

    function getMemoryPhotos() {
        return memoryPhotos.map((photo) => ({ ...photo }));
    }

    /**
     * Connect gallery navigation and viewer controls.
     */
    function init() {
        render();

        const mainButton = getElement("open-memories-button");
        const memoryButton = getElement("open-memory-gallery-button");
        const backButton = getElement("back-to-gallery-button");
        const voiceButton = getElement("open-voice-from-memories-button");
        const closeButton = getElement("close-photo-viewer");
        const dialog = getElement("photo-viewer");

        if (mainButton) {
            mainButton.addEventListener("click", open);
        }

        if (memoryButton) {
            memoryButton.addEventListener("click", openMemories);
        }

        if (backButton) {
            backButton.addEventListener("click", open);
        }

        if (voiceButton) {
            voiceButton.addEventListener("click", () => {
                if (window.BirthdayCountdown) {
                    window.BirthdayCountdown.showSection("voice-section");
                }
            });
        }

        if (closeButton) {
            closeButton.addEventListener("click", closeViewer);
        }

        if (dialog) {
            // Close when the user taps the backdrop.
            dialog.addEventListener("click", (event) => {
                if (event.target === dialog) {
                    closeViewer();
                }
            });

            // Optional previous/next controls, if added to the HTML.
            const previousButton = getElement("viewer-previous");
            const nextButton = getElement("viewer-next");

            if (previousButton) {
                previousButton.addEventListener("click", () => {
                    changePhoto(-1);
                });
            }

            if (nextButton) {
                nextButton.addEventListener("click", () => {
                    changePhoto(1);
                });
            }
        }
    }

    return {
        render,
        open,
        openMemories,
        openViewer,
        closeViewer,
        getPhotos,
        getMemoryPhotos,
        init
    };
})();

window.MemoriesGallery = MemoriesGallery;

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        MemoriesGallery.init,
        { once: true }
    );
} else {
    MemoriesGallery.init();
}
