(function ($, Drupal) {
    Drupal.behaviors.menuTabs = {
        attach: function (context, settings) {
            // handler
            $('.bolezni__nav').once('menuTabs').on('click', '.bolezni__navItem', function(e) {
                
                if (!$(this).hasClass('active')) {
                    $('.bolezni__navItem.active').removeClass('active');
                    $(this).addClass('active');
                    
                    if (this.dataset.showAll != undefined) {
                        $('.bolezni__group').find('[data-show]').fadeIn(400);
                    } else {                        
                        let letter = this.dataset.letter;
                        $('.bolezni__group').find('[data-show]').hide();
                        $('.bolezni__group').find('[data-show="'+letter+'"]').fadeIn(400);
                    }
                }

                return false;
            });
        }
    };
})(jQuery, Drupal);