console.log('bot starts')
var Twit = require('twit');
var config = require('./config');
var Repeat = require('./repeat');
var T = new Twit(config);
// get post and stream
var stream_get = T.stream('user');	//user stream
var MarkovChain = require('markovchain')
  , fs = require('fs')
  , quotes = new MarkovChain(fs.readFileSync('./quotes.txt', 'utf8'))
 
var useUpperCase = function(wordList) {
  var tmpList = Object.keys(wordList).filter(function(word) {
    return word[0] >= 'A' && word[0] <= 'Z'
  })
  return tmpList[~~(Math.random()*tmpList.length)]
}
 
var stopAfterFiveWords = function(sentence) {
  return sentence.split(" ").length >= 10
}

var markovify = function() {
		var now = quotes.start(useUpperCase).end(stopAfterFiveWords).process();
		console.log(now)
		tweetReply(now)
}	

Repeat(markovify).every(1000*10, 'ms').for(2, 'minutes').start.in(5, 'sec');
stream_get.on('follow', followed);	//when there is a follow event
stream_get.on('tweet', tweetEvent); //when there is a tweet event
stream_get.on('favorite',favoriteEvent);	//when there is a favorite event
//setInterval(markovify, 1000*10)	//milliseconds into seconds


function favoriteEvent(eventMsg) {
	var name = eventMsg.source.id;
	var screenName = eventMsg.source.screen_name;
	var r = Math.floor(Math.random()*10);
	console.log('favorite event ' +screenName);
	if (screenName !== 'sndpwrites') {
	tweetReply('@' + screenName + ' likes my tweets ' + r);
	}
}

function tweetEvent(eventMsg) {
	
	var fs = require('fs');
	var json = JSON.stringify(eventMsg,null,2);
	fs.writeFile("tweet.json", json);

	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;
	var from_name = eventMsg.user.name;
	var r = Math.floor(Math.random()*10);
	if (replyto === 'sndpwrites') {
		var newtweet = '@' + from + ' yes I like to reply, '+ from_name + ' ' + r;
		tweetReply(newtweet);
	}
}

function followed(eventMsg) {
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
	var r = Math.floor(Math.random()*10);
	console.log('follow event ' +screenName);
	if (screenName !== 'sndpwrites') {
	tweetReply('@' + screenName + ' hey thanks for follow ' + name + ' ' + r);
	}
}

function tweetReply(txt) {
	var tweet = {
		status: txt
	}
	T.post('statuses/update', tweet, tweeted);

}

function tweetSearch() {
	var params = {
	q : 'nepal since:2011-11-11',
	count : 5
};

//T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}
}

/*
function processing() {
	var filename = 'rainbow/output.png'
	var params = {
		encoding: 'base64'
	}
	var b64content = fs.readFileSync(filename,params);
	T.post('media/upload', { media_data:b64content }, uploaded);
	function uploaded(err, data, response) {
		var id = data.media_id_string;
		var tweet = {
			status:'i tweet image', media_ids: [id]
		}
		tweetReply(tweet)
	}
}
*/

function tweeted(err, data, response) {
	if (err) {
		console.log("tweet error!");
	} else {
		console.log('tweet success');
	}
}
