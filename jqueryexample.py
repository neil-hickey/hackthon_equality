# -*- coding: utf-8 -*-
"""
    jQuery Example
    ~~~~~~~~~~~~~~

    A simple application that shows how Flask and jQuery get along.

    :copyright: (c) 2010 by Armin Ronacher.
    :license: BSD, see LICENSE for more details.
"""
from flask import Flask, jsonify, render_template, request
import urllib
app = Flask(__name__)


@app.route('/_add_numbers')
def add_numbers():
    """Add two numbers server side, ridiculous but well..."""
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)

@app.route('/tweet')
def tweet():
    """Gets locations and tweets"""
    _from = request.args.get('from','')
    _to = request.args.get('to','')
    get_or_offer = ''
    text = ''
    if "give" in request.args:
        text = "I am offering a lift from " + _from + " to " + _to + " on May 22nd! "
        get_or_offer = "offer"
    elif "need" in request.args:
        text = "I need a lift from {0} to {1} on May 22nd".format(_from, _to)
        get_or_offer = "request"
    print urllib.quote(text)
    twitter_code = ("<a href='https://twitter.com/intent/tweet?button_hashtag=LiftToVote&text=" + text + 
    "' class='twitter-hashtag-button' data-size='large'>Tweet #LiftToVote</a><script>!function(d,s,id)"
    "{var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id))"
    "{js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}"
    "(document,'script', 'twitter-wjs');</script>")

    return render_template('index.html',twitter_code=twitter_code, get_or_offer=get_or_offer)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
