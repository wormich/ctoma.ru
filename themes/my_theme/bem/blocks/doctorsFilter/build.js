(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var search = require('./components/search.vue');

(function ($, Drupal) {

    new Vue({
        el: '#doctorsFilter',
        components: {
        },
        data: {
            all_clinics: [],
            spec: [],
            preloader: true,
            select_clinik: false, //tid выбранной клиники, по умолчанию false - все клиники
            select_spek: false, // tid выбранной специализации, по умолчанию - все специализации
            doctors: [], // список докторов
            count: false,
            page: 1 //текущая пагинация
        },
        computed: {
            page_index: function(){
                return '?page=' + (this.page - 1);
            },
            last_page: function(){
                if(this.count % 5 == 0){
                    return parseInt(this.count / 5, 10);
                }    
                else if(this.count){
                    return parseInt(this.count / 5 + 1, 10);
                } 
                else {
                    return false;
                }
            },
            pagination_render: function(){

                var count = 7;
                var pagination = [];

                for (var i = 1; i <= this.last_page; i++) {
                    if(pagination.length >= count){
                        break;
                    }

                    if(this.page-3 < i){
                        pagination.push(i);
                    }
                }

                return pagination;
            }
        },
        created: function () {

            /* Получаем список клиник */
            this.get_all();

            this.get_spec();

            this.get_doctors();
        },
        methods: {

            loaded: function (){
                if(this.all_clinics && this.spec && this.doctors){
                    this.preloader = false;
                }
            },

            get_url_webform: function(nid){
                return "/form/zapisatsa-k-vracu?doctor_nid=" + nid;
            },

            isLastPagin: function(){
                return this.page == this.last_page;
            },

            isFirstPagin: function(){
                return this.page == 1;
            },

            /* Определяем активный пагинатор - вещаем класс */
            isActivePagin: function(page){
                return this.page == page;
            },

            /* Определяем активную слинику - вещаем класс */
            isActiveClinic: function(tid){
                return tid == this.select_clinik;
            },

            /* Определяем активную специализацию - вещаем класс */
            isActiveSpec: function(tid){
                return tid == this.select_spek;
            },

            initAjax: function(){
                this.$nextTick(function() {
                    //удалим предыдущие обработчики
                    var ajax_elem = $('.doctorsFilter .use-ajax');

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
                    this.loaded();
                });
            },

            /* Получаем все клиники */
            get_all: function(){
                Vue.http.get('/all-clinic').then(function(response) {
                    /* Записываем в массив всех клиник */
                    this.all_clinics = response.body;
                    this.loaded();
                }.bind(this), function(response) {
                    console.log(response);
                }.bind(this));
            },

            /* Получаем доступные специализации текущей клиники */
            /* Если не заддана клиника выводим все доступные спецификации для всех клиник */
            /* Доступные - значит есть врач как минимум 1 с такой специализацией */
            get_spec: function(){

                if(this.select_clinik) {
                    /* Получаем доступные специализации выбранной клиники */
                    Vue.http.get('/api-doctors-get-spec/' + this.select_clinik).then(function(response) {
                        /* Записываем в массив все доступные специализации */
                        this.spec = response.body;
                        this.loaded();
                    }.bind(this), function(response) {
                        console.log(response);
                    }.bind(this));
                } else {
                    /* Получаем доступные специализации всех клиник */
                    Vue.http.get('/api-doctors-get-spec-all').then(function(response) {
                        /* Записываем в массив все доступные специализации */
                        this.spec = response.body;
                        this.loaded();
                    }.bind(this), function(response) {
                        console.log(response);
                    }.bind(this));
                }

            },
            /* Выбираем клинику */
            select_clinic: function(tid) {
                this.select_clinik = tid ? tid : false;
                this.get_spec();
                this.select_spec();
                this.page = 1;
            },
            /* Выбираем специализацию */
            select_spec: function(tid) {
                this.select_spek = tid ? tid : false;
                this.get_doctors();
                this.page = 1;
            },
            /* Плучаем докторов */
            get_doctors: function(){
                /* Если */
                if(this.select_clinik){
                    if(this.select_spek) {
                        /* Выводим врачей в определенной клинике с определенной специализацией */
                        Vue.http.get('/api-get-doctors/' + this.select_clinik + '/' + this.select_spek + this.page_index).then(function(response) {
                            this.doctors = response.body.results;
                            this.count = response.body.count;
                            this.initAjax();
                        }.bind(this), function(response) {
                            console.log(response);
                        }.bind(this));
                    } else {
                        /* Выводим врачей в определенной клинике со всеми специализациями */
                        Vue.http.get('/api-get-doctors-clinic/' + this.select_clinik + this.page_index).then(function(response) {
                            this.doctors = response.body.results;
                            this.count = response.body.count;
                            this.initAjax();
                        }.bind(this), function(response) {
                            console.log(response);
                        }.bind(this));
                    }
                } else {
                    if(this.select_spek) {
                        /* Выводим врачей всех клиник с определенной специализацией */
                        Vue.http.get('/api-get-doctors-spec/' + this.select_spek + this.page_index).then(function(response) {
                            this.doctors = response.body.results;
                            this.count = response.body.count;
                            this.initAjax();
                        }.bind(this), function(response) {
                            console.log(response);
                        }.bind(this));
                    } else {
                        /* Выводим врачей всех клиник со всеми специализациями */
                        Vue.http.get('/api-get-doctors-all' + this.page_index).then(function(response) {
                            this.doctors = response.body.results;
                            this.count = response.body.count;
                            this.initAjax();
                        }.bind(this), function(response) {
                            console.log(response);
                        }.bind(this));
                    }
                }
            },
            pagination_next: function(){
                if(this.page < this.last_page){
                    this.page++;
                    this.get_doctors();
                }
            },
            pagination_select: function(page){
                if(page >= 1 && page <= this.last_page){
                    this.page = page;
                    this.get_doctors();
                }
            },
            pagination_first: function(){
                this.page = 1;
                this.get_doctors();
            },
            pagination_last: function(){
                this.page = this.last_page;
                this.get_doctors();
            }
        }
    });
})(jQuery, Drupal);
},{}]},{},[1]);
