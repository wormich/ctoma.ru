var swiper = new Swiper('.articlesSlide__slider', {
    speed: 800,
    slidesPerView: 4,
    spaceBetween: 15,
    grabCursor: true,
    nextButton: '.articlesSlide__ButtonNext',
    prevButton: '.articlesSlide__ButtonPrev',

    breakpoints: {
        768: {
            slidesPerView: 3
        },
        640: {
            slidesPerView: 2
        },
        320: {
            slidesPerView: 1
        }
    }
});