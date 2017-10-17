'use strict';

const dynamoDbClient = require('serverless-dynamodb-client');
const dynamoDb = dynamoDbClient.doc;
const Airplanes = require('./airplanes.js');
let airplanes = new Airplanes(dynamoDb, `WheresBEFAAirplanesTable-${process.env.STAGE}`);

module.exports.getAllAirplanes = (event, context, callback) => {
  airplanes.getAll(callback);
}
;
module.exports.postAirplane = (event, context, callback) => {
  const body = JSON.parse(event.body);
  airplanes.post(body, callback);
};
