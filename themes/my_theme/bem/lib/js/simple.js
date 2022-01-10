
(function ($) {
    



    $(function(){

$('.menu_ml').on('click',function(){
    var elem= $(this)
    //$('.serviceMenu__list li .serviceMenu__list').hide()


elem.toggleClass('sub_open')
elem.toggleClass('sub_close')
    elem.parent().find(".serviceMenu__list").toggle()
    
    
    
})


        $('.otzyvyView__content .views-row').each(function () {
            $(this).append( "<span class='more'>Подробнее</span>" )
            $(this).click(function () {
                $(this).toggleClass("active");
                $('.more', this).text(function(i, text){
                    return text === "Подробнее" ? "Закрыть" : "Подробнее";
                })
            });
        });
        $('.uslugiView__content .view-grouping').each(function () {
            var serviceLink = $('.view-grouping-header a', this).attr('href');
            $(this).append("<a class='more' href='" + serviceLink + "'>Посмотреть весь список</a>");
        });

    });

})(jQuery);