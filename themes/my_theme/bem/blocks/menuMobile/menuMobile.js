(function ($) {
    'use strict';

    // handler
    $('.menuMobile').each(function(){
        var menu = $(this);
        $('.menuMobile__button', menu).click(function(){
            if(menu.hasClass('menuMobile_active')){
                menu.removeClass('menuMobile_active');
            } else {
                menu.addClass('menuMobile_active');
            }
        });
    });

}(jQuery));