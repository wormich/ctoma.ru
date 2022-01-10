(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function ($, Drupal) {
    new Vue({
        el: '#worksHome',
        data: {
            show: false,
            works: []
        },
        computed: {},
        created: function () {
            /* Получаем список отзывов */
            this.get_all();
        },
        methods: {
            /* Получаем все отзывы */
            get_all: function () {
                Vue.http.get('/restwork/?_format=hal_json').then(function (response) {

                    /* Записываем в массив всех акции */
                    this.works = response.body;
                    if (this.works.length != 0)this.show = true;

                    this.swiper_init();
                }.bind(this), function (response) {
                    console.log(response);
                }.bind(this));
            },
            swiper_init: function () {
                this.$nextTick(function () {
                    new Swiper('.works__swiper', {
                        nextButton: '.works__swiperButtonNext',
                        prevButton: '.works__swiperButtonPrev',
                        effect: 'fade',
                        loop: true
                    });
                })
            }
        }
    });

    new Vue({
        el: '#worksDoctor',
        data: {
            show: false,
            works: []
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
            }
        },
        created: function () {
            /* Получаем список отзывов */
            this.get_all();
        },
        methods: {

            /* Получаем все отзывы */
            get_all: function () {

                var pathArray = drupalSettings.path.currentPath.split('/');
                var nid = 0;
                if(pathArray.length == 2 && pathArray[0] == "node"){
                    nid = pathArray[1];
                }
                if(nid){
                    Vue.http.get('/restwork/' + nid+'/?_format=hal_json').then(function (response) {
                        /* Записываем в массив всех акции */
                        this.works = response.body;
                        if (this.works.length != 0)this.show = true;

                        this.swiper_init();
                        this.initAjax();
                    }.bind(this), function (response) {
                        console.log(response);
                    }.bind(this));
                }
            },
            swiper_init: function () {
                this.$nextTick(function () {
                    new Swiper('.works__swiper', {
                        nextButton: '.works__swiperButtonNext',
                        prevButton: '.works__swiperButtonPrev',
                        effect: 'fade',
                        loop: true
                    });
                })
            },
            initAjax: function(){
                this.$nextTick(function () {
                    //удалим предыдущие обработчики
                    var ajax_elem = $('.works .use-ajax');

                    ajax_elem.off();
                    ajax_elem.each(function () {
                        const element_settings = {};
                        // Clicked links look better with the throbber than the progress bar.
                        element_settings.progress = { type: 'throbber' };

                        // For anchor tags, these will go to the target of the anchor rather
                        // than the usual location.
                        const href = $(this).attr('href');
                        if (href) {
                            element_settings.url = href;
                            element_settings.event = 'click';
                        }
                        element_settings.dialogType = $(this).data('dialog-type');
                        element_settings.dialogRenderer = $(this).data('dialog-renderer');
                        element_settings.dialog = $(this).data('dialog-options');
                        element_settings.base = $(this).attr('id');
                        element_settings.element = this;
                        Drupal.ajax(element_settings);
                    });
                });
            }
        }
    });

})(jQuery, Drupal);
},{}]},{},[1]);
