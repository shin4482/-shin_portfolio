document.addEventListener("DOMContentLoaded", () => {

    /*
     * =========================================================
     * GOOGLE APPS SCRIPT WEB APP
     * =========================================================
     */

    const TESTIMONIAL_API =
        "https://script.google.com/macros/s/AKfycbxS13xPvRn95mG_-RKpLSjXQHz2IO0DV6FjofzKX-yz4njefrjCb-Uacz3WekU7Jvi6/exec";


    /*
     * =========================================================
     * GOOGLE FORM
     * =========================================================
     */

    const FEEDBACK_FORM_URL =
        "https://docs.google.com/forms/d/1kRQ2thSS6DwnC6CLwWpONDzCCjmQf-sj3BDQEDuzbT0/view";


    /*
     * =========================================================
     * TESTIMONIAL CONTAINER
     * =========================================================
     */

    const testimonialGrid =
        document.querySelector(".testimonial-grid");


    /*
     * =========================================================
     * LEAVE FEEDBACK BUTTON
     * =========================================================
     */

    const feedbackButton =
        document.getElementById("open-feedback");


    if (feedbackButton) {

        feedbackButton.addEventListener("click", () => {

            window.location.href =
                FEEDBACK_FORM_URL;

        });

    }


    /*
     * =========================================================
     * LOAD TESTIMONIALS
     * =========================================================
     */

    async function loadTestimonials() {

        if (!testimonialGrid) {
            return;
        }


        /*
         * Start with an empty testimonial area.
         * No placeholder text.
         */

        testimonialGrid.innerHTML = "";


        try {

            const response =
                await fetch(TESTIMONIAL_API);


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }


            const testimonials =
                await response.json();


            /*
             * No approved testimonials yet.
             * Leave the area empty.
             */

            if (
                !Array.isArray(testimonials) ||
                testimonials.length === 0
            ) {

                return;

            }


            /*
             * Create testimonial cards.
             */

            testimonials.forEach(
                testimonial => {

                    const card =
                        createTestimonialCard(
                            testimonial
                        );


                    testimonialGrid.appendChild(
                        card
                    );

                }
            );


        } catch (error) {

            /*
             * Keep the testimonial area empty
             * if the API is unavailable.
             */

            console.error(
                "Unable to load testimonials:",
                error
            );

            testimonialGrid.innerHTML = "";

        }

    }


    /*
     * =========================================================
     * CREATE TESTIMONIAL CARD
     * =========================================================
     */

    function createTestimonialCard(
        testimonial
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "testimonial-card";


        /*
         * Rating
         */

        const rating =
            document.createElement(
                "div"
            );


        rating.className =
            "testimonial-rating";


        rating.textContent =
            formatRating(
                testimonial.rating
            );


        /*
         * Feedback
         */

        const feedback =
            document.createElement(
                "p"
            );


        feedback.className =
            "testimonial-text";


        feedback.textContent =
            testimonial.feedback;


        /*
         * Author
         */

        const author =
            document.createElement(
                "div"
            );


        author.className =
            "testimonial-author";


        /*
         * Name
         */

        const name =
            document.createElement(
                "strong"
            );


        name.textContent =
            testimonial.name ||
            "Anonymous";


        /*
         * Service / Project
         */

        const service =
            document.createElement(
                "span"
            );


        service.textContent =
            testimonial.service ||
            "";


        /*
         * Build author section
         */

        author.appendChild(
            name
        );


        if (
            testimonial.service
        ) {

            author.appendChild(
                service
            );

        }


        /*
         * Build testimonial card
         */

        article.appendChild(
            rating
        );

        article.appendChild(
            feedback
        );

        article.appendChild(
            author
        );


        return article;

    }


    /*
     * =========================================================
     * FORMAT RATING
     * =========================================================
     */

    function formatRating(
        rating
    ) {

        const numericRating =
            parseInt(
                rating,
                10
            );


        if (
            Number.isNaN(
                numericRating
            )
        ) {

            return "★★★★★";

        }


        const safeRating =
            Math.min(
                5,
                Math.max(
                    1,
                    numericRating
                )
            );


        return (
            "★".repeat(
                safeRating
            ) +
            "☆".repeat(
                5 - safeRating
            )
        );

    }


    /*
     * =========================================================
     * START TESTIMONIAL SYSTEM
     * =========================================================
     */

    loadTestimonials();

});
