const buildSlideMarkup = (count) => {
    let slideMarkup = '';
    for (var i = 1; i <= count; i++) {
        slideMarkup += '<slide><span class="label">' + i + '</span></slide>'
    }
    return slideMarkup;
};

new Vue({
    el: '#slider',
    data: {
        slides: '',
        preloader: true
    },
    components: {
        'carousel': VueCarousel.Carousel,
        'slide': VueCarousel.Slide
    },
    template:
    '<carousel :perPage="1">' +
        '<img src="themes/my_theme/bem/blocks/slider/img/preloader.gif" v-if="preloader" class="slider__preloader"/>' +
        '<slide class="slider__slide" v-for="slide in slides">' +
            '<a class="slider__link" v-bind:href="slide.field_link">' +
                '<img class="slider__imgD" v-bind:src="slide.field_desctop">' +
                '<img class="slider__imgP" v-bind:src="slide.field_phone" >' +
            '</a>' +
        '</slide>' +
    '</carousel>',

    created: function(){
        Vue.http.get('/rest/slider').then(response => {
            this.slides = response.body;
            this.loaded();
        }, response => {
            console.log("error /rest/slider");
            this.loaded();
        });
    },
    methods: {
        loaded: function (){
            this.preloader = false;
        }
    }
});