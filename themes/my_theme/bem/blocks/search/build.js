(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
new Vue({
    el: '#search',
    data: {
        rez_doctors: '',
        rez_uslugi: '',
        rez_clinics: '',
        rez_news: '',
        rez_akcia: '',
        question: '',
        preloader: true,
        show: false
    },
    created: function () {
    },
    watch: {
        question: function (newQuestion) {
            this.getAnswer();
            this.preloader = true;
        }
    },
    methods: {
        close: function() {
            this.show = false;
        },
        /* Метод по поиску */
        search: function () {
            this.preloader = true;
            var This = this;


            this.$http.get('/search/news?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                console.log(response.body);
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_news = response.body;
                } else {
                    This.rez_news = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });
            
            this.$http.get('/search/akcii?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                console.log(response.body);
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_akcia = response.body;
                } else {
                    This.rez_akcia = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });


            this.$http.get('/search/doctors?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                console.log(response.body);
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_doctors = response.body;
                } else {
                    This.rez_doctors = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });




            this.$http.get('/search/uslugi?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_uslugi = response.body;
                } else {
                    This.rez_uslugi = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });



            this.$http.get('/search/clinics?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_clinics = response.body;
                } else {
                    This.rez_clinics = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });

        },
        /* Метод отслеживает запускает функции с задержкой */
        getAnswer: _.debounce(function () {
            if (this.question == "") {
                this.show = false;
            } else {
                this.search();
            }
        }, 500)
    }
});

new Vue({
    el: '#searchM',
    data: {
        rez_doctors: '',
        rez_uslugi: '',
        rez_clinics: '',
        rez_news: '',
        rez_akcia: '',
        question: '',
        preloader: true,
        show: false
    },
    created: function () {
    },
    watch: {
        question: function (newQuestion) {
            this.getAnswer();
            this.preloader = true;
        }
    },
    methods: {
        close: function() {
            this.show = false;
        },
        /* Метод по поиску */
        search: function () {
            this.preloader = true;
            var This = this;

            this.$http.get('/search/news?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                console.log(response.body);
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_news = response.body;
                } else {
                    This.rez_news = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });
            
            this.$http.get('/search/akcii?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                console.log(response.body);
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_akcia = response.body;
                } else {
                    This.rez_akcia = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });


            this.$http.get('/search/doctors?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                console.log(response.body);
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_doctors = response.body;
                } else {
                    This.rez_doctors = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });



            this.$http.get('/search/uslugi', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_uslugi = response.body;
                } else {
                    This.rez_uslugi = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });

            this.$http.get('/search/clinics?_format=hal_json', {
                params: {
                    q: this.question
                }
            }).then(function (response) {
                This.show = true;
                This.preloader = false;
                if(response.body.length > 0) {
                    This.rez_clinics = response.body;
                } else {
                    This.rez_clinics = false;
                }
            }, function (response) {
                This.preloader = false;
                console.log(response);
            });

        },
        /* Метод отслеживает запускает функции с задержкой */
        getAnswer: _.debounce(function () {
            if (this.question == "") {
                this.show = false;
            } else {
                this.search();
            }
        }, 500)
    }
});
},{}]},{},[1]);
