var modal = require('./components/modal.vue');

new Vue({
    el: '#choosingClinic',
    components: {
        'modal': modal
    },
    data: {
        current_clinic: false,
        all_clinics: [],
        show_list: false,
        leave_timer: false,
        showModal: false
    },
    created: function () {
        /* Получаем текущюю клинику */
        this.get_current();
        /* Получаем все клиники */
        this.get_all();
    },
    computed: {
        /*  Проверяем можно ли вывести модальное окно */
        checkViewModal: function () {
            if(!this.$cookie.get('current')) {
                var self = this;
                setTimeout(function(){
                    self.showModal = true;
                }, 500);
            }

            return this.current_clinic && this.all_clinics.length && this.showModal;
        }
    },
    methods: {
        /* Получаем текущюю выбранную клинику */
        get_current: function(){
            Vue.http.get('/current-clinic').then(function(response) {
                /* Записываем текущюю клинику */
                this.current_clinic = response.body[0];
            }.bind(this), function(response) {
                console.log(response);
            }.bind(this));
        },
        /* Получаем все клиники */
        get_all: function(){
            Vue.http.get('/all-clinic').then(function(response) {

                /* Записываем в массив всех клиник */
                this.all_clinics = response.body;

            }.bind(this), function(response) {
                console.log(response);
            }.bind(this));
        },
        /* Показать список */
        list_toogle: function (event) {
            this.show_list = !this.show_list;
        },
        /* Выбираем клинику */
        select_clinic: function(tid) {
            this.$cookie.set('current', tid);
            this.$cookie.set('Drupal_visitor_current', tid); //хрен знает зачем в модуле view_extras нужен этот куки
            location.reload();
        },
        /*  */
        mouseOver: function(){
            //console.log('over');
            if(this.leave_timer){
                clearTimeout(this.leave_timer);
            }
        },
        mouseLeave: function(){
            //console.log('leave');
            var self = this;
            this.leave_timer = setTimeout(function(){
                self.show_list = false;
            }, 600);
        },

        current_select: function(){
            this.$cookie.set('current', this.current_clinic.tid);
            this.$cookie.set('Drupal_visitor_current', this.current_clinic.tid); //хрен знает зачем в модуле view_extras нужен этот куки
            this.showModal = false;
        }
    }
});