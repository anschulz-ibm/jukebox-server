/* eslint no-process-env: 0 */

require('dotenv').config();

const environment = ['NODE_ENV', 'PORT', 'VOLUMIO_HOST', 'VOLUMIO_FOLDER'];

environment.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`${name}: ${process.env[name]}`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  VOLUMIO_HOST: process.env.VOLUMIO_HOST,
  VOLUMIO_FOLDER: process.env.VOLUMIO_FOLDER,
  PORT: process.env.PORT,
  maxVotingOptions: 5
};
