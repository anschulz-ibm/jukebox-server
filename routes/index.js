var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/song/next', function(req, res, next) {
  request('http://localhost:3000/api/v1/commands/?cmd=next', function(error, response, body) {
	res.json(JSON.parse(body))
  });
});

router.post('/song/prev', function(req, res, next) {
  request('http://localhost:3000/api/v1/commands/?cmd=prev', function(error, response, body) {
	res.json(JSON.parse(body))
  });
});

router.get('/queue', function(req, res, next) {
  request('http://localhost:3000/api/v1/getQueue', function(error, response, body) {
	const obj = JSON.parse(body);
	var songs = []
	// TODO add vote count
	obj.queue.forEach(element => songs.push(element.name));
	res.json(songs)
  });
});

module.exports = router;
