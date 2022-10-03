const Votes = require('./voting.model');
const validationResult = require('express-validator').validationResult;
const config = require('../../config');

const volumio = require('./volumio.controller');

var allSongs = []
var candidates = []
var votedForCurrentSong = []

var voteTimer;

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  let j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
  }

function fillCandidates() {
	// reset candidates and votes
	candidates.length = 0;
	votedForCurrentSong.length = 0;

	// find <config.maxVotingOptions number> candidates
	shuffle(allSongs);
	var newCandidates = allSongs.slice(0, config.maxVotingOptions);
	candidates = newCandidates.map((element) => {return new Votes(element, 0)});

	console.log(candidates)
}

async function processVotes() {
	
	var winner = candidates[0];

	// look for candidate with highest vote count
	for(var i = 1; i < candidates.length; i++) {
		var candidate = candidates[i];
		if(candidate.numVotes > winner.numVotes) {
			candidate = winner;
		}
		else if(candidate.numVotes == winner.numVotes) {
			// if same count of votes, pick one of them at random
			winner = Math.random() < 0.5 ? candidate : winner;
		}
	}

	console.log("Winner: " + JSON.stringify(winner));

	// add to queue
	console.log(await volumio.queue.add(winner.song));
	// if not already playing (first start), start now
	console.log(await volumio.playback.play());

	var status = await volumio.status();
	var queue = await volumio.queue.get();
	
	console.log("Status: " + JSON.stringify(status))

	// time of current running song
	var timeRemaining = (status.duration * 1000) - status.seek;

	// on the first run, the queue has no second song
	if(queue.length > 1) {
		// add duration of next song
		timeRemaining += queue[queue.length - 1].duration * 1000;
	}

	// start next vote
	fillCandidates();
	console.log(timeRemaining - (10 * 1000))
	voteTimer = setTimeout(processVotes, timeRemaining - (10 * 1000));
}

module.exports.init = async () => {

	console.log("Init Volumio connection");

	// init volumio connection
	await volumio.init();

	console.log("Fetch alls songs from: " + config.VOLUMIO_FOLDER);

	// get all songs from volumio
	allSongs = await volumio.browse();
	
	// init candidates
	fillCandidates();

	// time initial vote (no song playing yet) to 10 seconds
	voteTimer = setTimeout(processVotes, 10 * 1000);
}

module.exports.view = async (req, res, next) => {
	res.json(candidates);
}

module.exports.cast = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	// check already voted
	if(votedForCurrentSong.includes(ip)) {
		return res.status(409).json({ errors: ["Already voted for the current songs"] });
	}

	// remember already voted
	votedForCurrentSong.push(ip);

	candidates[req.body.song].numVotes++;

	res.status(200).json(candidates[req.body.song]);
};