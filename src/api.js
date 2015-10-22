var api = {
  getVenue: function () {
    var data = {
      positions: 'll=-34.603760,-58.415243'
    };
    $.ajax({
      url: 'http://localhost:3000/foursquare/venues',
      type: 'GET',
      data: data,
      success: function (results) {
        console.log(results);
      },
      error: function () {
        console.log(arguments);
      }
    });
  },
  getTip: function () {
    var data = {
      tip_id: '4eaf024f9a521bacdb216401'
    };
    $.ajax({
      url: 'http://localhost:3000/foursquare/tip',
      type: 'GET',
      dataType: 'json',
      data: data,
      success: function (results) {
        console.log(results);
      },
      error: function () {
        console.log(arguments);
      }
    });
  },
  getTips: function () {
    var data = {
      venue_id: '430d0a00f964a5203e271fe3'
    };
    $.ajax({
      url: 'http://localhost:3000/foursquare/tips',
      method: 'GET',
      dataType: 'json',
      data: data,
      success: function (results) {
        console.log(results);
      },
      error: function () {
        console.log(arguments);
      }
    });
  }
};

