var api = {
  getVenue: function () {
    var data = {
      positions: 'll=40.7,-74'
    };
    $.ajax({
      url: 'http://localhost:3000/foursquare/venues',
      type: 'GET',
      data: data,
    }).then(function () {
      console.log('finished: ', arguments);
    });
  },
  getTip: function () {
    var data = {
      tip_id: '4eaf024f9a521bacdb216401'
    };
    $.ajax({
      url: 'http://localhost:3000/foursquare/tip',
      type: 'GET',
      data: data,
    }).then(function () {
      console.log('finished: ', arguments);
    });
  },
  getTips: function () {
    var data = {
      venue_id: '430d0a00f964a5203e271fe3'
    };
    $.ajax({
      url: 'http://localhost:3000/foursquare/tips',
      method: 'GET',
      data: data,
    }).then(function () {
      console.log('finished: ', arguments);
    });
  }
};

