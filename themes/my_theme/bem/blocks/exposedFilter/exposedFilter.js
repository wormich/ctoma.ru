(function ($) {
    'use strict';
    $('.exposedFilter').each(function(){
        var block = $(this),
            form  = $('form', block);

        $("input, select", form).change(function(){
           form.submit();
        });
    });
}(jQuery));