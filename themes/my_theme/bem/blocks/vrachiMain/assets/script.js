
jQuery(document).ready(function($){
  $('.doctorsFilter__selectDoctor > .views-row').addClass('flavor');
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
    $('.form-item-field-mesta-raboty-target-id select option[value=All]').html('Все клиники');
    $('.form-item-field-specialization-target-id select option[value=44]').html('Ортодонтия');
    $('.form-item-field-specialization-target-id select option[value=43]').html('Ортопедия');
    $('.form-item-field-specialization-target-id select option[value=45]').html('Пародонтология');
    $('.form-item-field-specialization-target-id select option[value=42]').html('Терапия');
    $('.form-item-field-mesta-raboty-target-id select').attr('multiple','multiple');
    $('.form-item-field-mesta-raboty-target-id select').attr('size', 9)

    $('.form-item-field-specialization-target-id select option[value=All]').html('Все специализации');
    $('.form-item-field-specialization-target-id select').attr('multiple','multiple');
    $('.form-item-field-specialization-target-id select').attr('size', 9)

    if ($(window).width() < 992){
      $(".form-item-field-mesta-raboty-target-id select").removeAttr("multiple");
      $(".form-item-field-mesta-raboty-target-id select").removeAttr("size");
      $(".form-item-field-specialization-target-id select").removeAttr("multiple");
      $(".form-item-field-specialization-target-id select").removeAttr("size");
    }


  });
