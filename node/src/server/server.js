var express = require( 'express' );
var app = express();

app.use( express.static( __dirname + '/../www' ) );

//landing page

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
var server = app.listen( 3000, function() {
    console.log('Listening on port %d', server.address().port);
});
