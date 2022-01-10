(function ($, Drupal) {

    new Vue({
        el: '#stomatologyHome',
        data: {
            show: false,
            doctors: []
        },
        computed: {},
        created: function () {
            /* Получаем список врачей */
            this.get_all();
        },
        methods: {
            /* Получаем всех врачей текущей клиники */
            get_all: function () {
                Vue.http.get('/doctors-current-clinic').then(function (response) {
                    /* Записываем в массив всех  */
                    this.doctors = response.body;
                    if (this.doctors.length != 0)this.show = true;
                    this.swiper_init();
                }.bind(this), function (response) {
                    console.log(response);
                }.bind(this));
            },
            swiper_init: function () {
                this.$nextTick(function (response) {
                    var galleryTop = new Swiper('.stomatology__swiper', {
                        nextButton: '.stomatology__swiperButtonNext',
                        prevButton: '.stomatology__swiperButtonPrev',
                        effect: 'fade'
                        //loop: true
                    });

                    var swiper = new Swiper('.stomatology__swiperThumbsWrap', {
                        spaceBetween: 60,
                        slidesPerView: 4,
                        touchRatio: 0.2,
                        slideToClickedSlide: true,
                        nextButton: '.stomatology__swiperThumbButtonNext',
                        prevButton: '.stomatology__swiperThumbButtonPrev',
                        breakpoints: {
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30
                            },
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 15
                            }
                        }
                    });

                    galleryTop.params.control = swiper;
                    swiper.params.control = galleryTop;
                })
            },

            zapis_url: function (nid) {
                return '/form/zapisatsa-k-vracu?doctor_nid=' + nid;
            }
        }
    });

    new Vue({
        el: '#stomatologyClinik',
        data: {
            show: false,
            doctors: []
        },
        computed: {},
        created: function () {
            /* Получаем список врачей */
            this.get_all();
        },
        methods: {
            /* Получаем всех врачей текущей клиники */
            get_all: function () {
                var pathArray = drupalSettings.path.currentPath.split('/');
                var tid = 0;
                if (pathArray.length == 3 && pathArray[0] == "taxonomy") {
                    tid = pathArray[2];
                }
                if (tid) {
                    Vue.http.get('/doctors-current-clinic/' + tid).then(function (response) {
                        /* Записываем в массив всех  */
                        this.doctors = response.body;
                        if (this.doctors.length != 0)this.show = true;
                        console.log("test2");
                        this.swiper_init();
                    }.bind(this), function (response) {
                        console.log(response);
                    }.bind(this));
                }
            },
            swiper_init: function () {
                this.$nextTick(function () {
                    var galleryTop = new Swiper('.stomatology__swiper', {
                        nextButton: '.stomatology__swiperButtonNext',
                        prevButton: '.stomatology__swiperButtonPrev',
                        effect: 'fade'
                        //loop: true
                    });
                    console.log("test");
                    var swiper = new Swiper('.stomatology__swiperThumbsWrap', {
                        spaceBetween: 60,
                        slidesPerView: 4,
                        touchRatio: 0.2,
                        slideToClickedSlide: true,
                        nextButton: '.stomatology__swiperThumbButtonNext',
                        prevButton: '.stomatology__swiperThumbButtonPrev',
                        breakpoints: {
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30
                            },
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 15
                            }
                        }
                    });

                    galleryTop.params.control = swiper;
                    swiper.params.control = galleryTop;
                })
            },

            zapis_url: function (nid) {
                return '/form/zapisatsa-k-vracu?doctor_nid=' + nid;
            }
        }
    });

})(jQuery, Drupal);