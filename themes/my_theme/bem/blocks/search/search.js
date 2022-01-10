new Vue({
    el: '#search',
    data: {
        rez_doctors: '',
        rez_uslugi: '',
        rez_clinics: '',
        rez_akcia: '',
        question: '',
        rez_news: '',
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

            this.$http.get('/search/news', {
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
            
            this.$http.get('/search/akcii', {
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

            this.$http.get('/search/doctors', {
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

            this.$http.get('/search/clinics', {
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
        rez_akcia: '',
        question: '',
        rez_news: '',
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

            this.$http.get('/search/news', {
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
            
            this.$http.get('/search/akcii', {
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
                
            this.$http.get('/search/doctors', {
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

            this.$http.get('/search/clinics', {
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