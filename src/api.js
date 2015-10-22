var api = {
  getVenue: function (pos, markerInstance) {
    var data = {
      positions: 'll=' + pos.lat + ',' + pos.lng
    };
    return $.ajax({
      url: 'http://localhost:3000/foursquare/venues',
      type: 'GET',
      data: data
    });
  },
  getTip: function () {
    var data = {
      tip_id: '4eaf024f9a521bacdb216401'
    };
    return $.ajax({
      url: 'http://localhost:3000/foursquare/tip',
      type: 'GET',
      dataType: 'json',
      data: data
    });
  },
  getTips: function () {
    var data = {
      venue_id: '430d0a00f964a5203e271fe3'
    };
    return $.ajax({
      url: 'http://localhost:3000/foursquare/tips',
      method: 'GET',
      dataType: 'json',
      data: data
    });
  }
};

