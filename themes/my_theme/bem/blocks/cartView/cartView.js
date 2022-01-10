(function ($) {
    'use strict';
    $('.cartView__qty input').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            $(this).change();
            e.preventDefault();
            return false;
        }
    });
    $('.cartView__qty form').submit(function(e) {
        e.preventDefault();
        return false;
    });
}(jQuery));