'use strict';

module.exports.cron = (event, context, callback) => {
  // cron logic here:
  // hit OpenSky API for those airplane's ADS-Bs
  // env vars: username, password
  // also need URL for airplanes API
  // if returned in query, update lat/long via put route
  console.log('I was called');
};
