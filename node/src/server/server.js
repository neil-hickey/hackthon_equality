var express = require( 'express' );
var app = express();

app.use( express.static( __dirname + '/../www' ) );

//landing page
/*
app.get('/', function( req, res ){
    res.send( "It works: " + new Date() );
});
*/
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
