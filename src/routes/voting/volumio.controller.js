const config = require('../../config');

const axios = require('axios').default;

const urls = {
	ping: `http://${config.VOLUMIO_HOST}/api/v1/ping`,
	playback: {
		play: `http://${config.VOLUMIO_HOST}/api/v1/commands/?cmd=play`,
		stop: `http://${config.VOLUMIO_HOST}/api/v1/commands/?cmd=stop`
	},
	queue: {
		clear: `http://${config.VOLUMIO_HOST}/api/v1/commands/?cmd=clearQueue`,
		add: `http://${config.VOLUMIO_HOST}/api/v1/addToQueue`,
		get: `http://${config.VOLUMIO_HOST}/api/v1/getQueue`
	},
	status: `http://${config.VOLUMIO_HOST}/api/v1/getState`,
	browse: `http://${config.VOLUMIO_HOST}/api/v1/browse?uri=music-library/USB/usb`
}

module.exports.init = async () => {

	var volumioAvailable = false;

	while(!volumioAvailable) {
		try {
			const response = await axios.get(urls.ping);
			console.log(response.data);

			volumioAvailable = response.data == 'pong';
		} catch (error) {
			console.log(error);
		}
	}

	await axios.get(urls.playback.stop);
	await axios.get(urls.queue.clear);
}

module.exports.playback = {
	play : async () => {
		return (await axios.get(urls.playback.play)).data;
	},
	stop : async () => {
		return (await axios.get(urls.playback.stop)).data;
	}
}

module.exports.queue = {
	clear : async () => {
		return (await axios.get(urls.queue.clear)).data;
	},
	add : async (song) => {
		return (await axios.post(urls.queue.add, [song])).data;
	},
	get: async () => {
		return (await axios.get(urls.queue.get)).data.queue;
	},
}

module.exports.status = async () => {
	return (await axios.get(urls.status)).data;
}

module.exports.browse = async () => {
	return (await axios.get(urls.browse)).data.navigation.lists[0].items;
}
