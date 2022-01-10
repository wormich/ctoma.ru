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
            Vue.http.get('/newsrest').then(function(response) {
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