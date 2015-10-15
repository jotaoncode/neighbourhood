var app = (function () {
  var map,
    listModel =  {
      markersDefinition : {
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
      },
      markersInstance: []
    };

  var FilterListViewModel = function (places) {
    var self = this, titlesContainer = $('#places');
    this.place = ko.observableArray(places);
    this.searchText = ko.observable("");

    this.findTitleInList = function (marker) {
      var title = _.find(titlesContainer.find('li'), function (title) {
        return $(title).text() === marker.title;
      });
      return $(title);
    };
    this.getMarkersMatchCriteria = function (criteria) {
      return _.filter(listModel.markersInstance, function (marker) {
        return marker.title.toLowerCase().indexOf(criteria.toLowerCase()) >= 0;
      });
    };
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

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: listModel.markersDefinition.home.pos,
      zoom: 15
    });
    _.each(listModel.markersDefinition, function (marker) {
      filterList.setMarkerRenderedInMap(new google.maps.Marker({
        map: map,
        position: marker.pos,
        title: marker.description
      }));
    });
  }
  var filterList = new FilterListViewModel(listModel.markersInstance);
  ko.applyBindings(filterList);
  return {
    initMap: initMap
  };
}());

