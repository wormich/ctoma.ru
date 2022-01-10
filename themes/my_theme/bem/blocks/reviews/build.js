(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                Vue.http.get('/otzyvy/?_format=hal_json').then(function(response) {
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
                
                console.log('test');
                
                var pathArray = drupalSettings.path.currentPath.split('/');
                var nid = 0;
                if(pathArray.length == 2 && pathArray[0] == "node"){
                    nid = pathArray[1];
                }
                if(nid){
                    Vue.http.get('/otzyvy-rest/' + nid+'?_format=hal_json').then(function(response) {
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
                    Vue.http.get('/otzyvy-clinik/' + tid+'/?_format=hal_json').then(function(response) {
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


},{}]},{},[1]);
