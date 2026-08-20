document.addEventListener("DOMContentLoaded", () => {

    /*
     * =========================================================
     * TESTIMONIAL SYSTEM CONFIGURATION
     * =========================================================
     */

    const GITHUB_USERNAME = "YOUR-GITHUB-USERNAME";
    const GITHUB_REPOSITORY = "YOUR-REPOSITORY-NAME";

    /*
     * The GitHub label used to identify testimonials
     * that you have approved for public display.
     */

    const APPROVED_LABEL = "approved";


    /*
     * =========================================================
     * ELEMENTS
     * =========================================================
     */

    const testimonialGrid =
        document.querySelector(".testimonial-grid");

    const feedbackModal =
        document.getElementById("feedback-modal");

    const openFeedbackButton =
        document.getElementById("open-feedback");

    const closeFeedbackButton =
        document.getElementById("close-feedback");

    const testimonialForm =
        document.getElementById("testimonial-form");

    const feedbackStatus =
        document.getElementById("feedback-status");


    /*
     * =========================================================
     * OPEN FEEDBACK MODAL
     * =========================================================
     */

    if (openFeedbackButton) {

        openFeedbackButton.addEventListener("click", () => {

            feedbackModal.classList.add("active");

            feedbackModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "feedback-modal-open"
            );

        });

    }


    /*
     * =========================================================
     * CLOSE FEEDBACK MODAL
     * =========================================================
     */

    function closeFeedbackModal() {

        if (!feedbackModal) {
            return;
        }

        feedbackModal.classList.remove("active");

        feedbackModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "feedback-modal-open"
        );

    }


    if (closeFeedbackButton) {

        closeFeedbackButton.addEventListener(
            "click",
            closeFeedbackModal
        );

    }


    /*
     * Close when clicking outside the modal
     */

    if (feedbackModal) {

        feedbackModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === feedbackModal
                ) {

                    closeFeedbackModal();

                }

            }
        );

    }


    /*
     * Close with ESC key
     */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeFeedbackModal();

            }

        }
    );


    /*
     * =========================================================
     * LOAD APPROVED TESTIMONIALS
     * =========================================================
     */

    async function loadTestimonials() {

        if (!testimonialGrid) {
            return;
        }

        /*
         * Clear the placeholder.
         */

        testimonialGrid.innerHTML = "";


        /*
         * GitHub Issues API
         *
         * Only issues with the APPROVED_LABEL
         * will be displayed.
         */

        const apiUrl =
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/issues?state=open&labels=${encodeURIComponent(APPROVED_LABEL)}&per_page=20`;


        try {

            const response =
                await fetch(apiUrl);


            if (!response.ok) {

                throw new Error(
                    `GitHub API error: ${response.status}`
                );

            }


            const issues =
                await response.json();


            /*
             * No approved testimonials
             */

            if (
                !Array.isArray(issues) ||
                issues.length === 0
            ) {

                showEmptyTestimonials();

                return;

            }


            /*
             * Display each approved testimonial.
             */

            issues.forEach((issue) => {

                const testimonial =
                    parseTestimonial(issue);

                if (testimonial) {

                    const card =
                        createTestimonialCard(
                            testimonial
                        );

                    testimonialGrid.appendChild(
                        card
                    );

                }

            });


            /*
             * If nothing could be parsed
             */

            if (
                testimonialGrid.children.length === 0
            ) {

                showEmptyTestimonials();

            }

        } catch (error) {

            console.error(
                "Unable to load testimonials:",
                error
            );

            showEmptyTestimonials();

        }

    }


    /*
     * =========================================================
     * PARSE TESTIMONIAL
     * =========================================================
     *
     * Expected GitHub Issue format:
     *
     * Name:
     * Business:
     * Role:
     * Rating:
     * Feedback:
     *
     */

    function parseTestimonial(issue) {

        const body =
            issue.body || "";


        const name =
            extractField(
                body,
                "Name"
            );


        const business =
            extractField(
                body,
                "Business"
            );


        const role =
            extractField(
                body,
                "Role"
            );


        const rating =
            extractField(
                body,
                "Rating"
            );


        const feedback =
            extractField(
                body,
                "Feedback"
            );


        if (
            !name ||
            !feedback
        ) {

            return null;

        }


        return {

            name: name,

            business:
                business ||
                "Client",

            role:
                role ||
                "",

            rating:
                normalizeRating(
                    rating
                ),

            feedback:
                feedback

        };

    }


    /*
     * =========================================================
     * EXTRACT ISSUE FIELD
     * =========================================================
     */

    function extractField(
        text,
        fieldName
    ) {

        const regex =
            new RegExp(
                `(?:^|\\n)${fieldName}:\\s*(.*)`,
                "i"
            );


        const match =
            text.match(regex);


        if (!match) {

            return "";

        }


        return match[1].trim();

    }


    /*
     * =========================================================
     * NORMALIZE RATING
     * =========================================================
     */

    function normalizeRating(
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
            testimonial.rating;


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
         * Author container
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
            testimonial.name;


        /*
         * Business / Role
         */

        const details =
            document.createElement(
                "span"
            );


        if (
            testimonial.role
        ) {

            details.textContent =
                `${testimonial.business} • ${testimonial.role}`;

        } else {

            details.textContent =
                testimonial.business;

        }


        author.appendChild(
            name
        );

        author.appendChild(
            details
        );


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
     * EMPTY TESTIMONIAL STATE
     * =========================================================
     */

    function showEmptyTestimonials() {

        if (!testimonialGrid) {
            return;
        }


        testimonialGrid.innerHTML = "";


        const emptyMessage =
            document.createElement(
                "p"
            );


        emptyMessage.className =
            "testimonial-empty";


        emptyMessage.textContent =
            "Client testimonials will appear here once approved.";


        testimonialGrid.appendChild(
            emptyMessage
        );

    }


    /*
     * =========================================================
     * SUBMIT TESTIMONIAL
     * =========================================================
     */

    if (testimonialForm) {

        testimonialForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                if (!feedbackStatus) {
                    return;
                }


                const name =
                    document
                        .getElementById(
                            "client-name"
                        )
                        .value
                        .trim();


                const business =
                    document
                        .getElementById(
                            "business-name"
                        )
                        .value
                        .trim();


                const role =
                    document
                        .getElementById(
                            "client-role"
                        )
                        .value
                        .trim();


                const rating =
                    document
                        .getElementById(
                            "rating"
                        )
                        .value
                        .trim();


                const testimonial =
                    document
                        .getElementById(
                            "testimonial"
                        )
                        .value
                        .trim();


                if (
                    !name ||
                    !business ||
                    !role ||
                    !rating ||
                    !testimonial
                ) {

                    feedbackStatus.textContent =
                        "Please complete all fields.";

                    return;

                }


                feedbackStatus.textContent =
                    "Preparing your feedback submission...";


                /*
                 * IMPORTANT:
                 *
                 * A browser should NOT contain a GitHub
                 * personal access token.
                 *
                 * Therefore the public website will
                 * prepare the testimonial data and open
                 * GitHub with the information ready to
                 * submit.
                 */


                const issueTitle =
                    `Testimonial — ${name}`;


                const issueBody =
`Name: ${name}
Business: ${business}
Role: ${role}
Rating: ${rating}
Feedback: ${testimonial}

---
Submitted through portfolio testimonial form.`;


                const githubUrl =
                    `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;


                feedbackStatus.textContent =
                    "Opening GitHub so you can submit your testimonial...";


                window.open(
                    githubUrl,
                    "_blank"
                );

            }
        );

    }


    /*
     * =========================================================
     * START TESTIMONIAL SYSTEM
     * =========================================================
     */

    loadTestimonials();

});
