(function ($, Drupal) {
    Drupal.behaviors.statusMessagesBehavior = {
        attach: function (context, settings) {
            // handler
            $('.statusMessages__message').once('myCustomBehavior').each(function(){
                var messages = $(this);
                $('.statusMessages__close', messages).click(function(){
                    messages.hide();
                })
            });
        }
    };
})(jQuery, Drupal);