(function ($) {
    'use strict';

    var block = $(".newProduct"),
        jcarousel = $('.jc__wrapper', block);

    function controllersHide(controllers) {
        controllers.hide();
        jcarousel.removeClass("jc__wrapperControl");
    }

    function controllersShow(controllers) {
        controllers.show();
        jcarousel.addClass("jc__wrapperControl");
    }

    jcarousel
        .on('jcarousel:reload jcarousel:create', function () {
            var carousel = $(this),
                width = carousel.innerWidth(),
                total_items = $('.jc__ul', jcarousel).find('.jc__li').length,
                controllers = $('.jc__controlPrev, .jc__controlNext', block);

            if (width >= 900) {
                if (total_items <= 6) {
                    controllersHide(controllers);
                } else {
                    controllersShow(controllers);
                }
                width = carousel.innerWidth();
                width = width / 6;
            } else if (width >= 800) {
                if (total_items <= 4) {
                    controllersHide(controllers);
                } else {
                    controllersShow(controllers);
                }
                width = carousel.innerWidth();
                width = width / 4;
            } else if (width > 600) {
                if (total_items <= 3) {
                    controllersHide(controllers);
                } else {
                    controllersShow(controllers);
                }
                width = carousel.innerWidth();
                width = width / 3;
            } else if (width > 400) {
                if (total_items <= 2) {
                    controllersHide(controllers);
                } else {
                    controllersShow(controllers);
                }
                width = carousel.innerWidth();
                width = width / 2;
            } else {
                if (total_items <= 1) {
                    controllersHide(controllers);
                } else {
                    controllersShow(controllers);
                }
                width = carousel.innerWidth();
            }
            carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
        })
        .jcarousel({
            wrap: 'circular'
        });
    //.jcarouselAutoscroll({
    //    interval: 8000,
    //    target: '+=1',
    //    autostart: true
    //});

    $('.jc__controlPrev', block)
        .jcarouselControl({
            target: '-=1'
        });

    $('.jc__controlNext', block)
        .jcarouselControl({
            target: '+=1'
        });

    jcarousel.touchwipe({
        wipeLeft: function () {
            jcarousel.jcarousel('scroll', '+=1');
        },
        wipeRight: function () {
            jcarousel.jcarousel('scroll', '-=1');
        },
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: false
    });

}(jQuery));