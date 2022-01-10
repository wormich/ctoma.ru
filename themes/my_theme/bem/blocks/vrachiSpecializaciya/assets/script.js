
jQuery(document).ready(function($){
  $('#all-flavors .views-row').addClass('flavor');
});


 jQuery(document).ready(function($) {

  var items = $("#all-flavors .flavor");
  var numItems = items.length;
  var perPage = 5;

  items.slice(perPage).hide();

  $('#pagination-container').pagination({
    items: numItems,
    itemsOnPage: perPage,
    prevText: "&laquo;",
    nextText: "&raquo;",
    onPageClick: function (pageNumber) {
      var showFrom = perPage * (pageNumber - 1);
      var showTo = showFrom + perPage;
      items.hide().slice(showFrom, showTo).show();
    }
  });
  $('#pagination-container').click(function () {
    $('body,html').animate({
      scrollTop: $(".doctors__container").offset().top
    }, 500);
  });
  
});


  jQuery(document).ready(function($) {
    $(".header__menu span.glavnoeMenu__a").replaceWith("<a href='/personal' class='glavnoeMenu__a' role='menuitem' data-drupal-link-system-path='personal'>Врачи</a>");

    $('.form-item-field-mesta-raboty-target-id select option[value=All]').html('Все клиники');
    $('.form-item-field-mesta-raboty-target-id select').attr('multiple','multiple');
    $('.form-item-field-mesta-raboty-target-id select').attr('size', 9)

    if ($(window).width() < 992){
      $(".form-item-field-mesta-raboty-target-id select").removeAttr("multiple");
      $(".form-item-field-mesta-raboty-target-id select").removeAttr("size");
    }


  });
