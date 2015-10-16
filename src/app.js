/**
 * Knockout Application for my neighbourhood.
 */
var app = (function () {
  var map,
    /***
     * This is the list of places
     */
    listModel =  {
      markersDefinition : {
        home: {
          pos: {
            lat: -34.6057242,
            lng: -58.415755399999966
          },
          title: "Home",
          description: '<div id="content"><div id="siteNotice"></div></div><h1 id="firstHeading" class="firstHeading">Home</h1><div id="bodyContent"><p>This is where I lived for 23 years</p></div>'
        },
        casaDelQueso: {
          pos: {
            lat: -34.603760,
            lng: -58.415243
          },
          title: "Casa del Queso",
          description: '<div id="content"><div id="siteNotice"></div></div><h1 id="firstHeading" class="firstHeading">Casa del Queso</h1><div id="bodyContent"><p>You will find a very nice beer, piano music cheese and some south food of Argentina here.</p></div>'
        },
        tierraSanta: {
          pos: {
            lat: -34.609030,
            lng: -58.414730
          },
          title: "Tierra Santa",
          description: '<div id="content"><div id="siteNotice"></div></div><h1 id="firstHeading" class="firstHeading">Tierra Santa</h1><div id="bodyContent"><p>Here I made my Primary School.</p></div>'
        },
        pioIx: {
          pos: {
            lat: -34.614650,
            lng: -58.421704
          },
          title: "Pio IX",
          description: '<div id="content"><div id="siteNotice"></div></div><h1 id="firstHeading" class="firstHeading">Pio IX</h1><div id="bodyContent"><p>This is where I did Secondary School.</p></div>'
        },
        utn: {
          pos: {
            lat: -34.598584,
            lng: -58.419998
          },
          title: "UTN",
          description: '<div id="content"><div id="siteNotice"></div></div><h1 id="firstHeading" class="firstHeading">UTN</h1><div id="bodyContent"><p>This is the place where I did University, and finished as System Information Engineer.</p></div>'
        },
        sanataBar: {
          pos: {
            lat: -34.605756,
            lng: -58.415116
          },
          title: "Sanata Bar",
          description: '<div id="content"><div id="siteNotice"></div></div><h1 id="firstHeading" class="firstHeading">Tango Bar</h1><div id="bodyContent"><p>Here is some tango music bar, where have a good dinner and listen music.</p></div>'
        }
      },
      markersInstance: []
    };

  /**
   * This is the List ViewModel
   * where I create things that works with List Model and The View
   */
  var FilterListViewModel = function (places) {
    var self = this, titlesContainer = $('#places');
    this.place = ko.observableArray(places);
    this.searchText = ko.observable("");

    /**
     * Search marker in map by title of place
     */
    this.searchByTitle = function (title) {
      var marker = self.getMarkerMatchString(title);
      _.each(listModel.markersInstance, function (marker) {
        marker.infoWindow.close();
      });
      self.toggleBounce(marker);
      marker.infoWindow.open(map, marker);
      map.setCenter(marker.pos);
    };
    /**
     * Show in map list option
     * @param {} listOption
     */
    this.showInMap = function (listOption) {
      self.searchByTitle(listOption.title);
    };

    /**
     * Find by title in list
     * will return a jquery object that matches the List Option
     * @param {} marker
     */
    this.findTitleInList = function (marker) {
      var title = _.find(titlesContainer.find('li'), function (title) {
        return $(title).text() === marker.title;
      });
      return $(title);
    };
    /**
     * Get Marker Match an string value,
     * will return the marker instance created from google maps
     * @param String stringValue
     */
    this.getMarkerMatchString = function (stringValue) {
      return _.find(listModel.markersInstance, function (marker) {
        return marker.title.toLowerCase() === stringValue.toLowerCase();
      });
    };
    /**
     * Get marker match criteria, will filter all the markers created
     * by google maps that has a substring with criteria string.
     * @param String criteria
     */
    this.getMarkersMatchCriteria = function (criteria) {
      return _.filter(listModel.markersInstance, function (marker) {
        return marker.title.toLowerCase().indexOf(criteria.toLowerCase()) >= 0;
      });
    };
    /**
     * This will set visibility to list and in the markers.
     */
    this.setVisibilityToList = function (list, bolean) {
      _.each(list, function (marker) {
        marker.setVisible(bolean);
        if (bolean) {
          self.findTitleInList(marker).show();
        } else {
          self.findTitleInList(marker).hide();
        }
      });
    };
    /**
     * This will filter actual markers by finding a list that succes with
     * criteria and a list that fails this criteria, and setting visibility to
     * each one.
     * @param String criteria
     */
    this.filterMarkers = function (criteria) {
      var titles = titlesContainer.find('li'),
          successList,
          failList;

      if (criteria === "") {
        this.setVisibilityToList(listModel.markersInstance, true);
        return;
      }

      successList = this.getMarkersMatchCriteria(criteria);
      failList = _.difference(listModel.markersInstance, successList);

      this.setVisibilityToList(successList, true);
      this.setVisibilityToList(failList, false);
    };

    /**
     * Sets a marker in the array observable of ko.
     * This place is the one from my list model.
     * @param {} place
     */
    this.setMarkerRenderedInMap = function (place) {
      this.place.push(place);
    };
    /**
     * Animation marker for bounce on selection
     * @param {} marker
     */
    this.toggleBounce = function (marker) {
      if(marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function () {
          marker.setAnimation(null);
        }, 1500);
      }
    };
  };

  /**
   * Init map will be called once google API response
   * and creates all the markers in list model.
   */
  function initMap() {
    var panorama;
    map = new google.maps.Map(document.getElementById('map'), {
      streetViewControl: true,
      center: listModel.markersDefinition.home.pos,
      zoom: 15
    });
    panorama = map.getStreetView();
    google.maps.event.addListener(panorama, 'visible_changed', function () {
      if (panorama.getVisible()) {
        $('.search-menu').hide();
      } else {
        $('.search-menu').show();
      }
    });
    _.each(listModel.markersDefinition, function (marker) {
      var markerInstance = new google.maps.Marker({
        map: map,
        streetViewControl: true,
        position: marker.pos,
        animation: google.maps.Animation.DROP,
        title: marker.title
      });
      markerInstance.infoWindow = new google.maps.InfoWindow({
        content: marker.description
      });
      markerInstance.addListener('click', function () {
        filterList.toggleBounce(markerInstance);
        markerInstance.infoWindow.open(map, markerInstance);
      });
      filterList.setMarkerRenderedInMap(markerInstance);
    });
  }
  var filterList = new FilterListViewModel(listModel.markersInstance);
  ko.applyBindings(filterList);
  return {
    initMap: initMap
  };
}());

$(function () {
  $(".button-collapse").sideNav({
    menuWidth: 200,
    edge: 'left',
    closeOnClick: true
  });
});
