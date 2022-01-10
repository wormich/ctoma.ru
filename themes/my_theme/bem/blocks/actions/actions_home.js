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
                Vue.http.get('/actons-front').then(function (response) {
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
                    Vue.http.get('/actons-clinik/' + tid).then(function (response) {
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



