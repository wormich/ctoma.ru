(function ($) {
    'use strict';

    $('.cataloguesTabs').each(function(){
        var tabs = $(this);
        $('.cataloguesTabs__controllTab', this).click(function(){
            if(!$(this).hasClass('active')){
                var id = $(this).attr('data-tab-id');


                $('.cataloguesTabs__controllTab', tabs).each(function(){
                    $(this).removeClass('active');
                });

                $('.cataloguesTabs__contentTab', tabs).each(function(){
                    $(this).removeClass('active');
                });

                $('#cataloguesTabs_' + id, tabs).addClass('active');
                $('#cataloguesTabs__controllTab_' + id, tabs).addClass('active');
            }
        });

    })

}(jQuery));