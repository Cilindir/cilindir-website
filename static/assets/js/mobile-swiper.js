document.addEventListener("DOMContentLoaded", () => {
    const swipers = [];

    // Initialize all Swipers
    document.querySelectorAll('.swiper-container').forEach(container => {
        const paginationSelector = container.dataset.pagination;
        const swiper = new Swiper(container, {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: paginationSelector,
                clickable: true,
            },
        });
        swipers.push(swiper);
    });

    // ------------------------------
    // Hero images scaling
    // ------------------------------
    const heroSlides = document.querySelectorAll('.hero-container .swiper-slide img');
    if (heroSlides.length) {
        let widest = 0;

        // Find natural width of widest image
        heroSlides.forEach(img => {
            if (img.naturalWidth > widest) {
                widest = img.naturalWidth;
            }
        });

        const containerWidth = document.querySelector('.hero-container .swiper-container').clientWidth;
        const scale = Math.min(1, containerWidth / widest);

        heroSlides.forEach(img => {
            img.style.height = `${img.naturalHeight * scale}px`;
            img.style.width = 'auto';
            img.style.display = 'block';
            img.style.margin = '0 auto';
        });
    }

    // ------------------------------
    // Normalize tile swiper heights
    // ------------------------------
    function normalizeSwiperSlideHeights(containerSelector) {
        const containers = document.querySelectorAll(containerSelector);

        containers.forEach(container => {
            const slides = container.querySelectorAll(".swiper-slide");
            if (!slides.length) return;

            const images = container.querySelectorAll("img");
            const promises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => (img.onload = resolve));
            });

            // Wait for all images to load
            Promise.all(promises).then(() => {
                let maxHeight = 0;

                // Reset heights first
                slides.forEach(slide => (slide.style.height = "auto"));

                // Find tallest slide
                slides.forEach(slide => {
                    const h = slide.offsetHeight;
                    if (h > maxHeight) maxHeight = h;
                });

                // Set all slides to tallest height
                slides.forEach(slide => (slide.style.height = maxHeight + "px"));
            });
        });
    }

    const tileSelector = `
    .use-cases-container .swiper-container.mobile-only,
    .stat-tile-grid-container .swiper-container.mobile-only
    .pricing-container .swiper-container.mobile-only
    `;
    normalizeSwiperSlideHeights(tileSelector);

    // ------------------------------
    // Update Swipers and normalize heights on window resize
    // ------------------------------
    window.addEventListener("resize", () => {
        swipers.forEach(swiper => swiper.update());
        normalizeSwiperSlideHeights(tileSelector);
    });
});