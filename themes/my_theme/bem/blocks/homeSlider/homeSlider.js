(function ($) {
    'use strict';

    var jcarousel = $('.homeSlider__jcarousel');

    jcarousel
        .on('jcarousel:reload jcarousel:create', function () {
            var carousel = $(this),
                width = carousel.innerWidth();

            carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
        })
        .jcarousel({
            wrap: 'circular'
        })
        .jcarouselAutoscroll({
            interval: 5000,
            target: '+=1',
            autostart: true
        });

    $('.homeSlider__controlPrev')
        .jcarouselControl({
            target: '-=1'
        });

    $('.homeSlider__controlNext')
        .jcarouselControl({
            target: '+=1'
        });

    $('.homeSlider__pagination')
        .on('jcarouselpagination:active', 'a', function() {
            $(this).addClass('active');
        })
        .on('jcarouselpagination:inactive', 'a', function() {
            $(this).removeClass('active');
        })
        .on('click', function(e) {
            e.preventDefault();
        })
        .jcarouselPagination({
            perPage: 1,
            item: function(page) {
                return '<a href="#' + page + '">' + page + '</a>';
            }
        });

    jcarousel.touchwipe({
        wipeLeft: function() {
            jcarousel.jcarousel('scroll', '+=1');
        },
        wipeRight: function() {
            jcarousel.jcarousel('scroll', '-=1');
        },
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: false
    });

}(jQuery));