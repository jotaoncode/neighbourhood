var app = (function () {
  var map,
  markers = [],
  markersDescription =  {
    home: {
      pos: {
        lat: -34.6057242,
        lng: -58.415755399999966
      },
      description: 'Home'
    },
    casaDelQueso: {
      pos: {
        lat: -34.603760,
        lng: -58.415243
      },
      description: 'Casa del Queso'
    },
    tierraSanta: {
      pos: {
        lat: -34.609030,
        lng: -58.414730
      },
      description: 'Tierra Santa'
    },
    pioIx: {
      pos: {
        lat: -34.614650,
        lng: -58.421704
      },
      description: 'Pio IX'
    },
    utn: {
      pos: {
        lat: -34.598584,
        lng: -58.419998
      },
      description: 'UTN'
    },
    sanataBar: {
      pos: {
        lat: -34.605756,
        lng: -58.415116
      },
      description: 'Sanata Bar'
    }
  };
  var FilterList = function (places) {
    var self = this;
    this.place = ko.observableArray(places);
    this.searchText = ko.observable("");
    this.filterMarkers = function (criteria) {
      if (criteria === "") {
        _.each(markers, function (marker) { marker.setVisible(true); });
        _.each(this.place, function (place) {
          $(place).show();
        });
        return;
      }
      var successList = _.filter(markers, function (marker) {
        return marker.title.toLowerCase().indexOf(criteria.toLowerCase()) >= 0;
      });

      var failList = _.difference(markers, successList);
      _.each(successList, function (marker) { marker.setVisible(true); });
      _.each(failList, function (marker) { marker.setVisible(false); });
    };
    this.currentSearch = ko.computed({
      read: function () {
        this.filterMarkers(this.searchText());
        return this.searchText();
      },
      owner: this
    });
    this.setMarkerRenderedInMap = function (place) {
      this.place.push(place);
    };
  };
  var filterList = new FilterList(markers);
  ko.applyBindings(filterList);
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: markersDescription.home.pos,
      zoom: 15
    });
    for (var name in markersDescription) {
      filterList.setMarkerRenderedInMap(new google.maps.Marker({
        map: map,
        position: markersDescription[name].pos,
        title: markersDescription[name].description
      }));
    }
  }
  return {
    initMap: initMap
  };
}());

