(function ($) {
    'use strict';

    // handler
    $('.catalogButton').each(function(){
        var catalogButton = $(this);
        $(catalogButton).click(function(){
            if(catalogButton.hasClass('catalogButton_active')){
                catalogButton.removeClass('catalogButton_active');
            } else {
                catalogButton.addClass('catalogButton_active');
            }
        });
    });

}(jQuery));