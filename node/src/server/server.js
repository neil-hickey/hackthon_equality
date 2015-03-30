var express = require( 'express' ),
    app = express(),
    bodyparser = require('body-parser'),
    fs = require('fs'),
    low = require('lowdb'),
    db = low('db.json', {
      autosave: true, // automatically save database on change (default: true)
      async: true     // asyncrhonous write (default: true)
   }),
   geo = {
     toRadians : function (angle) {
       return angle * Math.PI / 180;
     },

     calcCrow : function (lat1, lon1, lat2, lon2) {
        var R = 3963,
            dLat = this.toRadians(lat2-lat1),
            dLon = this.toRadians(lon2-lon1),
            lat1 = this.toRadians(lat1),
            lat2 = this.toRadians(lat2),
            a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
            d = R * c;
        console.log(lat1);
        console.log(lon1);
        console.log(lat2);
        console.log(lon2);

        return d;
     }
   };

app.use( express.static( __dirname + '/../www' ) );
app.use(bodyparser.urlencoded({limit: "2000kb" }));

//landing page

app.get('/result/:route', function (req, res) {
  var route = db('results').find({ url : req.params.route }),
      resultspage = fs.readFileSync(__dirname + '/../www/results.html').toString();

  
  resultspage = resultspage.replace(/MILES/g, parseFloat(route.miles).toFixed(1));
  resultspage = resultspage.replace(/PLACEHOLDER_TO/g, route.routeTo);
  resultspage = resultspage.replace(/PLACEHOLDER_FROM/g, route.routeFrom);

  console.log(route);
  res.send(resultspage);

});

app.get('/directions', function (req, res) {
    var _from = req.query['from']
    var _to = req.query['to']
    var api_key = "AIzaSyCLUu_ddLIhvxq9TamyKldfflyXfQrQYYM"
    var url = "https://www.google.com/maps/embed/v1/directions?key=" + api_key + "&origin=" + _from + "&destination=" + _to + "&mode=transit";
    var height = 640
    var width = 480
    res.send("<iframe src='" + url + "' height='" + height + "' width='" + width + "'></iframe>");
});

app.get('/tweet', function (req, res) {
    var _from = req.query['from']
    var _to = req.query['to']
    var text = ""
    if("need" in req.query) {
        text = "I need a lift from " + _from + " to " + _to + " on May 22nd! "
    }
    else if ("give" in req.query) {
        text = "I am offering a lift from " + _from + " to " + _to + " on May 22nd! "
    }
    res.send("<a href='https://twitter.com/intent/tweet?button_hashtag=LiftToVote&text=" + text +
            "' class='twitter-hashtag-button' data-size='large'>Tweet #LiftToVote</a><script>!function(d,s,id)" +
            "{var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id))" +
            "{js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}" +
            "(document,'script', 'twitter-wjs');</script>");
    
});

app.get('/miles', function (req, res) {
  var miles = 0;

  db('miles').each(function (record) {
    miles += record;
  });

  res.end(""+miles);
});


app.post("/calculate", function (req, res) {

  var route = {
    url   : Math.random().toString(36).substring(7),
    miles : geo.calcCrow(req.body.location1lon, req.body.location1lat, req.body.location2lon, req.body.location2lat),
    routeTo : req.body.routeTo,
    routeFrom : req.body.routeFrom
  };  

  db('results').push(route);

  db('miles').push(route.miles);

  res.send({ url : route.url, miles : route.miles });

});

var server = app.listen( 3000, function() {
    console.log('Listening on port %d', server.address().port);
});
