'use strict';

const request = require('request');
const async = require('async');
const _ = require('underscore');

module.exports.cron = (event, context, callback) => {
  const apiUrl = process.env.API_URL;
  const openSkyUsername = process.env.OPEN_SKY_USERNAME;
  const openSkyPassword = process.env.OPEN_SKY_PASSWORD;
  const query = process.env.ADSB_QUERY;
  const openSkyURL = `http://${openSkyUsername}:${openSkyPassword}@opensky-network.org/api/states/all?${query}`;

  let data = {};

  async.series([
      callOpenSky.bind(null, data),
      getAirplanes.bind(null, data),
      updateAirplanes.bind(null, data)
    ], err => {
      if (err)
        console.log(err);
      console.log('Completed airplane updates');
    }
  );

  function callOpenSky(data, callback) {
    console.log('Calling OpenSky');

    request(openSkyURL,
      (err, response, body) => {
        if (err)
          return callback(err);

        console.log('Open sky returned: ', body)

        if (body.states)
          data.states = JSON.parse(body.states);

        return callback();
      }
    );
  }

  function getAirplanes(data, callback) {
    if (!data.states) return callback();
    console.log('Getting airplanes');

    request(apiUrl,
      (err, response, airplanes) => {
        if (err)
          return callback(err);

        var parsedAirplanes = JSON.parse(airplanes);

        data.airplanes = {};

        _.each(parsedAirplanes, airplane => {
          console.log(airplane.ADSB)
          data.airplanes[airplane.ADSB] = airplane.tailNumber;
        });
        console.log(data.airplanes)
        return callback();
      }
    );
  }

  function updateAirplanes(data, callback) {
    if (!data.states) return callback();
    console.log('Updating airplanes');

    // data.states = [
    //   [
    //     "aa38f3",
    //     null,
    //     null,
    //     null,
    //     null,
    //     100,
    //     45
    //   ]
    // ]

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
            url: apiUrl,
            body: JSON.stringify(update)
          },
          (err, response, airplanes) => {
            if (err)
              return callback(err);

            console.log("Successfully updated " + data.airplanes[state[0]])
          }
        )
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
