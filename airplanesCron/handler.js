'use strict';

const request = require('request');
const async = require('async');
const _ = require('underscore');

module.exports.cron = (event, context, callback) => {
  let data = {
    apiUrl: process.env.API_URL
  };

  async.series([
      getAirplanes.bind(null, data),
      callOpenSky.bind(null, data),
      updateAirplanes.bind(null, data)
    ], err => {
      if (err)
        console.log(err);
      console.log('Completed airplane updates');
    }
  );

  function getAirplanes(data, callback) {
    console.log('Getting airplanes');

    request(data.apiUrl,
      (err, response, airplanes) => {
        if (err)
          return callback(err);

        var parsedAirplanes = JSON.parse(airplanes);

        if (!parsedAirplanes || !parsedAirplanes.length)
          return callback();

        data.airplanes = {};

        _.each(parsedAirplanes, airplane => {
          data.airplanes[airplane.ADSB] = airplane.tailNumber;
        });

        return callback();
      }
    );
  }

  function callOpenSky(data, callback) {
    if (!data.airplanes) return callback();
    console.log('Calling OpenSky');

    const openSkyUsername = process.env.OPEN_SKY_USERNAME;
    const openSkyPassword = process.env.OPEN_SKY_PASSWORD;

    const openSkyQuery = _.reduce(data.airplanes, (query, value, key) => {
      return query + `icao24=${key}&`;
    }, '');
    const openSkyURL = `http://${openSkyUsername}:${openSkyPassword}@opensky-network.org/api/states/all?${openSkyQuery}`;

    request(openSkyURL,
      (err, response, body) => {
        if (err)
          return callback(err);

        console.log('Open sky returned: ', body);

        if (body.states)
          data.states = JSON.parse(body.states);

        return callback();
      }
    );
  }

  function updateAirplanes(data, callback) {
    if (!data.states) return callback();
    console.log('Updating airplanes');

    async.each(data.states,
      (state, done) => {
        const update = {
          ADSB: state[0],
          tailNumber: data.airplanes[state[0]],
          latitude: state[6],
          longitude: state[5]
        };

        request.post({
            headers: {'content-type': 'application/json'},
            url: data.apiUrl,
            body: JSON.stringify(update)
          },
          (err, response, airplanes) => {
            if (err)
              return callback(err);

            console.log(`Updated ${data.airplanes[state[0]]} with latitude ${state[6]} and longitude ${state[5]}`);
          }
        );
      },
      err => {
        if (err) {
          console.log(err);
          return callback(err);
        }
        return callback();
      }
    );
  }
};
