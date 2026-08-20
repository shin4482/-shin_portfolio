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
     * TESTIMONIAL CONTAINER
     * =========================================================
     */

    const testimonialGrid =
        document.querySelector(".testimonial-grid");


    /*
     * =========================================================
     * LOAD TESTIMONIALS
     * =========================================================
     */

    async function loadTestimonials() {

        if (!testimonialGrid) {
            console.error(
                "Testimonial grid not found."
            );

            return;
        }


        /*
         * Show loading message
         */

        testimonialGrid.innerHTML = `
            <p class="testimonial-loading">
                Loading testimonials...
            </p>
        `;


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
             * No testimonials yet
             */

            if (
                !Array.isArray(testimonials) ||
                testimonials.length === 0
            ) {

                showEmptyTestimonials();

                return;

            }


            /*
             * Clear loading message
             */

            testimonialGrid.innerHTML = "";


            /*
             * Create testimonial cards
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

            console.error(
                "Unable to load testimonials:",
                error
            );


            testimonialGrid.innerHTML = `
                <p class="testimonial-loading">
                    Testimonials are temporarily unavailable.
                </p>
            `;

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
         * Build card
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
     * EMPTY STATE
     * =========================================================
     */

    function showEmptyTestimonials() {

        testimonialGrid.innerHTML = `
            <p class="testimonial-loading">
                Client testimonials will appear here
                once approved.
            </p>
        `;

    }


    /*
     * =========================================================
     * START
     * =========================================================
     */

    loadTestimonials();

});
