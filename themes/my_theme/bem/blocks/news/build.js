(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
new Vue({
    el: '#newsHome',
    data: {
        show: false,
        news: [],
        active_news: false
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
            Vue.http.get('/newsrest/?_format=hal_json').then(function(response) {
                /* Записываем в массив всех новостей */
                this.news = response.body;
                this.select(0);
                if(this.news.length != 0)this.show = true;
            }.bind(this), function(response) {
                console.log(response);
            }.bind(this));
        },

        select: function(index){
            this.active_news = this.news[index];
        },

        isActiveNews:function(nid){
            return this.active_news.nid == nid;
        }
    }
});
},{}]},{},[1]);
