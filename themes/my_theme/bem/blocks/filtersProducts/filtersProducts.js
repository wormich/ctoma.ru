(function ($) {
    'use strict';
    $('.filtersProducts').each(function(){
        var block = $(this);
        $('.filtersProducts__filterButton', block).click(function(){
            if(block.hasClass("filtersProducts_filtersActive")){
                block.removeClass("filtersProducts_filtersActive");
            } else {
                block.addClass("filtersProducts_filtersActive");
            }
        });
        $('.filtersProducts__right', block).click(function(){
            block.removeClass("filtersProducts_filtersActive");
        });

    });
}(jQuery));