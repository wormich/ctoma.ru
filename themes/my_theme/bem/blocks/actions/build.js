(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function ($, Drupal) {

    new Vue({
        el: '#actionsHome',
        data: {
            show: false,
            actions: []
        },
        computed: {},
        created: function () {
            /* Получаем список акций */
            this.get_all();
        },
        methods: {
            /* Получаем все акции */
            get_all: function () {
                Vue.http.get('https://ctoma.ru/actons-front?_format=hal_json').then(function (response) {
                    /* Записываем в массив всех акции */
                    this.actions = response.body;
                    if (this.actions.length != 0)this.show = true;
                    this.swiper_init();
                }.bind(this), function (response) {
                    console.log(response);
                }.bind(this));
            },
            swiper_init: function () {
                this.$nextTick(function () {
                    new Swiper('.actions__swiper', {
                        pagination: '.actions__swiperPagination',
                        paginationClickable: true,
                        nextButton: '.actions__swiperButtonNext',
                        prevButton: '.actions__swiperButtonPrev',
                        spaceBetween: 30,
                        effect: 'fade',
                        loop: true
                    });
                })
            },
            zapis_url: function (nid) {
                return '/form/zapisatsa-po-akcii?action_nid=' + nid;
            }
        }
    });

    new Vue({
        el: '#actionsClinik',
        data: {
            show: false,
            actions: []
        },
        computed: {},
        created: function () {
            /* Получаем список акций */
            this.get_all();
        },
        methods: {
            /* Получаем все акции */
            get_all: function () {

                var pathArray = drupalSettings.path.currentPath.split('/');
                var tid = 0;
                if (pathArray.length == 3 && pathArray[0] == "taxonomy") {
                    tid = pathArray[2];
                }
                if (tid) {
                    Vue.http.get('https://ctoma.ru/actons-clinik/' + tid+'/?_format=hal_json').then(function (response) {
                        /* Записываем в массив всех акции */
                        this.actions = response.body;
                        if (this.actions.length != 0)this.show = true;

                        this.swiper_init();
                    }.bind(this), function (response) {
                        console.log(response);
                    }.bind(this));
                }
            },
            swiper_init: function () {
                this.$nextTick(function () {
                    new Swiper('.actions__swiper', {
                        pagination: '.actions__swiperPagination',
                        paginationClickable: true,
                        nextButton: '.actions__swiperButtonNext',
                        prevButton: '.actions__swiperButtonPrev',
                        spaceBetween: 30,
                        effect: 'fade',
						autoHeight: true,
                        loop: true
                    });
                })
            },
            zapis_url: function (nid) {
                return '/form/zapisatsa-po-akcii?action_nid=' + nid;
            }
        }
    });

})(jQuery, Drupal);




},{}]},{},[1]);
