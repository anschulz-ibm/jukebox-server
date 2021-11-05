const express = require('express');
const catchErrors = require('express-catch-errors');
const body = require('express-validator').body;
const config = require('../../config');

const router = express.Router();
const {
	cast,
	view
} = require('./voting.controller');

router
	.route('/cast')
	.post(
		body('song')
			.isNumeric().withMessage('Must be numeric')
			.isLength({ min: 0, max: config.maxVotingOptions }).withMessage('Must be between 0 and ' + config.maxVotingOptions), 
		catchErrors(cast)
	)

router
	.route('/')
	.get(catchErrors(view))

module.exports = router;