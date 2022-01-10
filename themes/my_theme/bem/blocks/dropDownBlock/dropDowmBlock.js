(function ($) {
    'use strict';

    // handler
    $('.dropDownBlock').each(function(){
        var dropDownBlock = $(this);
        $('.dropDownBlock__more', dropDownBlock).click(function(){
            if(dropDownBlock.hasClass('dropDownBlock_active')){
                dropDownBlock.removeClass('dropDownBlock_active');
            } else {
                dropDownBlock.addClass('dropDownBlock_active');
            }
        });
    });

}(jQuery));