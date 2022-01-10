(function ($) {
    'use strict';

    // Перерисовываем страницу после отработки прелоадера
    Pace.on("done", function(){
        $(window).resize();
        setTimeout(function(){
            $(window).resize();
            //gmap_init();
        }, 300);
    });

}(jQuery));