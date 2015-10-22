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
          description: {
            head: 'Home',
            body: 'This is where I lived for 23 years'
          }
        },
        casaDelQueso: {
          pos: {
            lat: -34.603760,
            lng: -58.415243
          },
          title: "Casa del Queso",
          description: {
            head: 'Casa del Queso',
            body: 'You will find a very nice beer, piano music cheese and some south food of Argentina here.'
          }
        },
        tierraSanta: {
          pos: {
            lat: -34.609030,
            lng: -58.414730
          },
          title: "Tierra Santa",
          description: {
            head: 'Tierra Santa',
            body: 'Here I made my Primary School.'
          }
        },
        pioIx: {
          pos: {
            lat: -34.614650,
            lng: -58.421704
          },
          title: "Pio IX",
          description: {
            head: 'Pio IX',
            body: 'This is where I did Secondary School.'
          }
        },
        utn: {
          pos: {
            lat: -34.598584,
            lng: -58.419998
          },
          title: "UTN",
          description: {
            head: 'UTN',
            body: 'This is the place where I did University, and finished as System Information Engineer.'
          }
        },
        sanataBar: {
          pos: {
            lat: -34.605756,
            lng: -58.415116
          },
          title: "Sanata Bar",
          description: {
            head: 'Sanata Bar',
            body: 'Here is some tango music bar, where have a good dinner and listen music.'
          }
        }
      },
      markersInstance: []
    };

  /**
   * This is the List ViewModel
   * where I create things that works with List Model and The View
   */
  var FilterListViewModel = function (places) {
    var self = this;
    this.places = ko.observableArray(places);
    this.isVisibleList = ko.observable(true);
    this.searchText = ko.observable("");

    /**
     * Show in map list option
     * @param {} listOption
     */
    this.showInMap = function (listOption) {
      var title = listOption.title,
        marker = self.getMarkerMatchString(title);
      _.each(listModel.markersInstance, function (marker) {
        marker.infoWindow.close();
      });
      self.toggleBounce(marker);
      marker.infoWindow.open(map, marker);
      map.setCenter({
        lat: marker.position.lat(),
        lng: marker.position.lng()
      });
    };

    /**
     * Find by title in list
     * will return a jquery object that matches the List Option
     * @param {} marker
     */
    this.findTitleInList = function (marker) {
      return _.find(this.places(), function (place) {
        return place.title === marker.title;
      });
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
     * This will set visibility to a sub-list of markers.
     */
    this.setVisibilityToList = function (list, isVisible) {
      _.each(list, function (marker) {
        marker.setVisible(isVisible);
        marker.isVisible(isVisible);
      });
    };

    /**
     * This will filter actual markers by finding a list that succes with
     * criteria and a list that fails this criteria, and setting visibility to
     * each one.
     * @param String criteria
     */
    this.filterMarkers = function (criteria) {
      var titles = this.places(),
          successList,
          failList;

      _.each(listModel.markersInstance, function (marker) {
        marker.infoWindow.close();
      });

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
     * This is a computed value that filters markers
     */
    this.currentSearch = ko.computed({
      read: function () {
        this.filterMarkers(this.searchText());
        return this.searchText();
      },
      owner: this
    });

    /**
     * Menu will be visible only on map view
     * @param bool isVisible
     */
    this.isMenuVisible = function (isVisible) {
      this.isVisibleList(isVisible);
    };
    /**
     * Sets a marker in the array observable of ko.
     * This place is the one from my list model.
     * @param {} place
     */
    this.setMarkerRenderedInMap = function (place) {
      this.places.push(place);
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
    var panorama,
    infoWindowTemplate = $('#info-window-template').html(),
    template = Handlebars.compile(infoWindowTemplate);

    map = new google.maps.Map(document.getElementById('map'), {
      streetViewControl: true,
      center: listModel.markersDefinition.home.pos,
      zoom: 15
    });
    panorama = map.getStreetView();
    google.maps.event.addListener(panorama, 'visible_changed', function () {
      filterList.isMenuVisible(!panorama.getVisible());
    });
    _.each(listModel.markersDefinition, function (marker) {
      var markerDescription,
      markerInstance = new google.maps.Marker({
        map: map,
        streetViewControl: true,
        position: marker.pos,
        animation: google.maps.Animation.DROP,
        title: marker.title
      });

      api.getVenue(marker.pos).then(function (results) {
        markerInstance.infoWindow = new google.maps.InfoWindow({
          content: template(marker.description || results.response)
        });
      });
      markerInstance.isVisible = ko.observable(markerInstance.visible);
      markerInstance.addListener('click', function () {
        filterList.showInMap(markerInstance);
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

