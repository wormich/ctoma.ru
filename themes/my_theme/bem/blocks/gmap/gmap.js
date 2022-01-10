function gmap_init() {

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    var myIcon = new google.maps.MarkerImage('/themes/my_theme/bem/blocks/gmap/img/marker@2x.png', null, null, null, new google.maps.Size(80,80));
    var spb = new google.maps.LatLng(-17.779499, 177.453989);

    directionsDisplay = new google.maps.DirectionsRenderer();
    var myOptions = {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        center: spb,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        language: 'en'
    };
    map = new google.maps.Map(document.getElementById("main_map"), myOptions);

    //marker
    var beachMarker = new google.maps.Marker({
        position: spb,
        map: map,
        title: "Greenleaf",
        icon: myIcon
    });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
        computeTotalDistance(directionsDisplay.directions);
    });
}