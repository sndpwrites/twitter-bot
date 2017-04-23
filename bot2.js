console.log('bot starts')
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
// get post and stream
var stream_get = T.stream('user');	//user stream

stream_get.on('follow', followed);	//when there is a follow event
stream_get.on('tweet', tweetEvent); //when there is a tweet event
stream_get.on('favorite',favoriteEvent);

function favoriteEvent(eventMsg) {
	var name = eventMsg.source.id;
	var screenName = eventMsg.source.screen_name;
	var r = Math.floor(Math.random()*100);
	console.log('favorite event ' +screenName);
	if (screenName !== 'sndpwrites') {
	tweetReply('.@' + screenName + ' likes my tweets ' + r);
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
	var r = Math.floor(Math.random()*100);
	if (replyto === 'sndpwrites') {
		var newtweet = '@' + from + ' yes I like to reply, '+ from_name + ' ' + r;
		tweetReply(newtweet);
	}
}

function followed(eventMsg) {
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
	var r = Math.floor(Math.random()*100);
	console.log('follow event ' +screenName);
	if (screenName !== 'sndpwrites') {
	tweetReply('.@' + screenName + ' hey thanks for follow ' + name + ' ' + r);
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
tweetIT();
setInterval(tweetIT, 1000*20)	//milliseconds into seconds

function tweetIT() {
	var r = Math.floor(Math.random()*100);
var tweet = {
	status: 'you are now ' + r + ' years old'
}
T.post('statuses/update', tweet, tweeted);
}
*/

/*+++++++++++++++++++++++++++++++++++++++++++*/
/*
var cmd='screenfetch';
//child preo
var exec = require('child_process').exec;
var fs = require('fs');
exec(cmd, processing);

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
