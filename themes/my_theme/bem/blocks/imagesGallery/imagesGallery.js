(function ($) {
    'use strict';

    Drupal.behaviors.imagesGallery = {
        attach: function (context, settings) {

            $('.cloud-zoom, .cloud-zoom-gallery').once().CloudZoom();

            $('.imagesGallery').once().each(function () {

                var imagesGallery = $(this);
                var cloudZoom = $('.cloud-zoom', imagesGallery);
                var prevControll = $('.imagesGallery__controlPrev', imagesGallery);
                var nextControll = $('.imagesGallery__controlNext', imagesGallery);

                prevControll.click(function (event) {

                    //получить текущий url
                    var currentHref = cloudZoom.attr("href");
                    var arraySelect = [];
                    var currentIndex = false;
                    //вызвать событие click на предыдущем элементе
                    $('.cloud-zoom-gallery', imagesGallery).each(function () {
                        var href = $(this).attr("href");

                        if (currentHref == href) {
                            currentIndex = arraySelect.length;
                        }

                        arraySelect.push(href);
                    });
                    currentIndex--;
                    if (currentIndex < 0) {
                        currentIndex = arraySelect.length - 1;
                    }
                    $('.cloud-zoom-gallery[href="' + arraySelect[currentIndex] + '"]', imagesGallery).click();

                });
                nextControll.click(function (event) {

                    //получить текущий url
                    var currentHref = cloudZoom.attr("href");
                    var arraySelect = [];
                    var currentIndex = false;
                    //вызвать событие click на предыдущем элементе
                    $('.cloud-zoom-gallery', imagesGallery).each(function () {
                        var href = $(this).attr("href");

                        if (currentHref == href) {
                            currentIndex = arraySelect.length;
                        }

                        arraySelect.push(href);
                    });
                    currentIndex++;
                    if (currentIndex >= arraySelect.length) {
                        currentIndex = 0;
                    }
                    $('.cloud-zoom-gallery[href="' + arraySelect[currentIndex] + '"]', imagesGallery).click();

                });

                imagesGallery.touchwipe({
                    wipeLeft: function () {
                        prevControll.click();
                    },
                    wipeRight: function () {
                        nextControll.click();
                    },
                    min_move_x: 20,
                    min_move_y: 20,
                    preventDefaultEvents: false
                });
            });

        }
    };

}(jQuery));