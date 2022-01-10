(function ($, Drupal) {

    //изначально показываем текущюю клинику на карте
    //в поиске выпадает список клиник по клику меняется информация и мапа

    var searchMap = new Vue({
        el: '#searchMap',
        data: {
            map: false,
            current_clinic: false,
            all_clinics: [],
            question: '',
            questionPos: false,
            yready: false,
            multiRoute: false,
            r_param: false
        },
        computed: {
            /* Свойсто зависищае от запроса */
            searchClinic: function () {
                return this.all_clinics.filter(function(item) {
                    return item.name.match(this.question)
                })
            }
        },
        created: function () {
            //получаем текущюю клинику
            this.get_current();
            //получаем все клиники
            this.get_all();
        },
        methods: {
            ymaps_ready: function () {
                this.yready = true;
                this.init();
            },
            init: function () {

                //перед определением текущей клиники определяем страницу
                //var tid_current_page = drupalSettings.path.currentPath;
                //console.log(tid_current_page);
                //если это страница клиники задаем текущюю клинику относительно страницы
                //пробегаем по всем клиникам и сверяем текущий патч и тид клиники
                var self = this;
                this.all_clinics.forEach(function(item, i, arr) {
                    if("taxonomy/term/" + item.tid == drupalSettings.path.currentPath){
                        self.current_clinic = item;
                    }
                });
                //проверяем заданна ли текущая клиника
                if (this.current_clinic && this.all_clinics.length && !this.map && this.yready) {
                    // Создаем карту и ставим центер на текущюю клинику
                    this.map = new ymaps.Map("searchMap__mapYandex", {
                        center: [59.94421707628917, 30.338121544921886],
                        zoom: 10
                    });

                    this.map.controls
                        .add('typeSelector');

                    this.addPlacemarks();
                }
            },
            /* Метод который дабавляет все клиники метками на карту */
            addPlacemarks: function () {

                var map = this.map;

                this.all_clinics.forEach(function (element, index) {

                    if(element.tid == searchMap.current_clinic.tid){
                        /* Активная метка */
                        myPlacemark = new ymaps.Placemark([element.field_h, element.field_d], {
                            hintContent: element.name
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: '/themes/my_theme/bem/blocks/searchMap/img/map_icon_a.png',
                            iconImageSize: [30, 30],
                            iconImageOffset: [-30, -30],
                            iconContentOffset: [15, 15]
                        });
                        /* Запоминаем ссылку на метку */
                        searchMap.current_clinic.myPlacemark = myPlacemark;
                    } else {
                        /* Обычная метка */
                        myPlacemark = new ymaps.Placemark([element.field_h, element.field_d], {
                            hintContent: element.name
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: '/themes/my_theme/bem/blocks/searchMap/img/map_icon.png',
                            iconImageSize: [30, 30],
                            iconImageOffset: [-30, -30],
                            iconContentOffset: [15, 15]
                        });
                        /* Запоминаем ссылку на метку */
                        searchMap.all_clinics[index].myPlacemark = myPlacemark;
                    }
                    /* Cобытие клика по метке */
                    myPlacemark.events.add('click', function () {
                        searchMap.select_clinic(element);
                    });
                    /* Дабавляем метку на карту */
                    map.geoObjects.add(myPlacemark);
                });
            },
            /* Выбираем клинику */
            select_clinic: function (clinic) {
                //this.$cookie.set('current', clinic.tid);
                //this.$cookie.set('Drupal_visitor_current', clinic.tid); //хрен знает зачем в модуле view_extras нужен этот куки

                var map = this.map;

                this.all_clinics.forEach(function (element, index) {

                    if(element.tid == searchMap.current_clinic.tid){

                        /* удаляем старую метку */
                        map.geoObjects.remove(searchMap.current_clinic.myPlacemark);

                        myPlacemark = new ymaps.Placemark([element.field_h, element.field_d], {
                            hintContent: element.name
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: '/themes/my_theme/bem/blocks/searchMap/img/map_icon.png',
                            iconImageSize: [30, 30],
                            iconImageOffset: [-30, -30],
                            iconContentOffset: [15, 15]
                        });
                        /* Cобытие клика по метке */
                        myPlacemark.events.add('click', function () {
                            searchMap.select_clinic(element);
                        });
                        searchMap.all_clinics[index].myPlacemark = myPlacemark;
                        map.geoObjects.add(myPlacemark);
                    }
                });

                searchMap.current_clinic = clinic;

                this.all_clinics.forEach(function (element, index) {
                    if(element.tid == searchMap.current_clinic.tid){

                        map.geoObjects.remove(searchMap.all_clinics[index].myPlacemark);

                        myPlacemark = new ymaps.Placemark([element.field_h, element.field_d], {
                            hintContent: element.name
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: '/themes/my_theme/bem/blocks/searchMap/img/map_icon_a.png',
                            iconImageSize: [30, 30],
                            iconImageOffset: [-30, -30],
                            iconContentOffset: [15, 15]
                        });
                        /* Cобытие клика по метке */
                        myPlacemark.events.add('click', function () {
                            searchMap.select_clinic(element);
                        });
                        searchMap.current_clinic.myPlacemark = myPlacemark;
                        map.geoObjects.add(myPlacemark);
                    }
                });
                searchMap.route();
            },
            /* Получаем текущюю выбранную клинику */
            get_current: function () {
                Vue.http.get('/current-clinic').then(function(response) {

                    /* Записываем текущюю клинику */
                    this.current_clinic = response.body[0];

                    this.init();
                }.bind(this), function(response) {
                    console.log(response);
                }.bind(this));
            },
            /* Получаем все клиники */
            get_all: function () {
                Vue.http.get('/all-clinic').then(function(response) {

                    /* Записываем в массив всех клиник */
                    this.all_clinics = response.body;

                    //console.log(this.all_clinics);


                    this.init();
                }.bind(this), function(response) {
                    console.log(response);
                }.bind(this));
            },

            /* Загружаем гео данные по адрессу */
            search: function () {
                /* Определяем запрос к геокодеру */
                var q = 'https://geocode-maps.yandex.ru/1.x/?geocode=Санкт-Петербург, ' + this.question + '&lang=ru_RU&results=1&format=json&sco=longlat';

                Vue.http.get(q).then(function(response) {

                    var pos = response.body.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                    var ArrayPos = pos.split(' ');

                    var minDistanse = false;
                    var clinic = false;

                    // Запоминаем последнюю точку запроса
                    searchMap.questionPos = [ArrayPos[1], ArrayPos[0]];

                    this.all_clinics.forEach(function (element, index) {
                        var distance = ymaps.coordSystem.geo.getDistance([element.field_h, element.field_d], searchMap.questionPos);

                        if(!minDistanse){
                            minDistanse = distance;
                            clinic = element;
                        } else {
                            if(distance <= minDistanse){
                                minDistanse = distance;
                                clinic = element;
                            }
                        }
                    });

                    searchMap.select_clinic(clinic);
                    searchMap.route();
                }.bind(this), function(response) {
                    console.log(response);
                }.bind(this));
            },

            /* Удаляем и дабавляем маршрут */
            route: function(){
                if(searchMap.multiRoute){
                    searchMap.map.geoObjects.remove(searchMap.multiRoute);
                }

                if(searchMap.questionPos) {
                    searchMap.multiRoute = new ymaps.multiRouter.MultiRoute({
                        // Описание опорных точек мультимаршрута.
                        referencePoints: [
                            searchMap.questionPos,
                            [searchMap.current_clinic.field_h, searchMap.current_clinic.field_d]
                        ],
                        // Параметры маршрутизации.
                        params: {
                            routingMode: searchMap.r_param,
                            // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
                            results: 2
                        }
                    }, {
                        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
                        boundsAutoApply: true
                    });

                    searchMap.map.geoObjects.add(searchMap.multiRoute);
                }
            },
            /* Построить маршрут на авто */
            r_bibi: function(){
                this.r_param = false;

                if(!searchMap.questionPos) {
                    this.$refs.question.focus();
                } else {
                    this.route();
                }
            },
            /* Построить маршрут на Общественном транспорте */
            r_ot: function(){
                this.r_param = 'masstransit';
                if(!searchMap.questionPos) {
                    this.$refs.question.focus();
                } else {
                    this.route();
                }
            },
            /* Построить маршрут на метро */
            r_toptop: function(){
                this.r_param = 'pedestrian';
                if(!searchMap.questionPos) {
                    this.$refs.question.focus();
                } else {
                    this.route();
                }
            }
        }
    });

    ymaps.ready(searchMap.ymaps_ready);

})(jQuery, Drupal);