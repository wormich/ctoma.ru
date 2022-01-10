(function ($, Drupal) {
    new Vue({
        el: '#reviewsHome',
        data: {
            show: false,
            reviews: []
        },
        computed: {
        },
        created: function () {
            /* Получаем список отзывов */
            this.get_all();
        },
        methods: {
            /* Получаем все отзывы */
            get_all: function(){
                Vue.http.get('/otzyvy').then(function(response) {
                    /* Записываем в массив всех акции */
                    this.reviews = response.body;
                    //console.log(this.reviews);
                    if(this.reviews.length != 0)this.show = true;

                    this.swiper_init();
                }.bind(this), function(response) {
                    console.log(response);
                }.bind(this));
            },
            swiper_init: function() {
                this.$nextTick(function() {
                    new Swiper('.reviews__swiper', {
                        nextButton: '.reviews__swiperButtonNext',
                        prevButton: '.reviews__swiperButtonPrev',
                        effect: 'fade',
                        loop: true
                    });
                })
            }
        }
    });

    new Vue({
        el: '#reviewsDoctor',
        data: {
            show: false,
            reviews: []
        },
        computed: {
            zapis_button: function(){
                var pathArray = drupalSettings.path.currentPath.split('/');
                var nid = 0;
                if(pathArray.length == 2 && pathArray[0] == "node"){
                    nid = pathArray[1];
                }
                if(nid){
                    return "/form/zapisatsa-k-vracu?doctor_nid=" + nid;
                }
                return "";
            },
            reviews_button: function(){
                var pathArray = drupalSettings.path.currentPath.split('/');
                var nid = 0;
                if(pathArray.length == 2 && pathArray[0] == "node"){
                    nid = pathArray[1];
                }
                if(nid){
                    return "/reviews/add?doctor_nid=" + nid;
                }
                return "";
            }
        },
        created: function () {
            /* Получаем список отзывов */
            this.get_all();
        },
        methods: {
            /* Получаем все отзывы */
            get_all: function(){
                var pathArray = drupalSettings.path.currentPath.split('/');
                var nid = 0;
                if(pathArray.length == 2 && pathArray[0] == "node"){
                    nid = pathArray[1];
                }
                if(nid){
                    Vue.http.get('/otzyvy-rest/' + nid).then(function(response) {
                        /* Записываем в массив все отзывы */
                        this.reviews = response.body;
                        //console.log(this.reviews);
                        if(this.reviews.length != 0)this.show = true;

                        this.swiper_init();
                    }.bind(this), function(response) {
                        console.log(response);
                    }.bind(this));
                }
            },

            swiper_init: function() {
                this.$nextTick(function() {
                    new Swiper('.reviews__swiper', {
                        nextButton: '.reviews__swiperButtonNext',
                        prevButton: '.reviews__swiperButtonPrev',
                        effect: 'fade',
                        loop: true
                    });
                })
            }
        }
    });

    new Vue({
        el: '#reviewsCkinic',
        data: {
            show: false,
            reviews: []
        },
        computed: {
        },
        created: function () {
            /* Получаем список отзывов */
            this.get_all();
        },
        methods: {
            /* Получаем все отзывы */
            get_all: function(){
                var pathArray = drupalSettings.path.currentPath.split('/');
                var tid = 0;
                if(pathArray.length == 3 && pathArray[0] == "taxonomy"){
                    tid = pathArray[2];
                }
                if(tid){
                    Vue.http.get('/otzyvy-clinik/' + tid).then(function(response) {
                        /* Записываем в массив все отзывы */
                        this.reviews = response.body;
                        //console.log(this.reviews);
                        if(this.reviews.length != 0)this.show = true;

                        this.swiper_init();
                    }.bind(this), function(response) {
                        console.log(response);
                    }.bind(this));
                }
            },

            swiper_init: function() {
                this.$nextTick(function() {
                    new Swiper('.reviews__swiper', {
                        nextButton: '.reviews__swiperButtonNext',
                        prevButton: '.reviews__swiperButtonPrev',
                        effect: 'fade',
                        loop: true
                    });
                })
            }
        }
    });

})(jQuery, Drupal);

