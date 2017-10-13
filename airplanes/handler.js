'use strict';

const dynamoDbClient = require('serverless-dynamodb-client');
const dynamoDb = dynamoDbClient.doc;

module.exports.getAirplanes = (event, context, callback) => {
  const params = {
    TableName: 'WheresBEFAAirplanesTable'
  }

  dynamoDb.scan(params,
    (err, result) => {
      if (err) {
        console.error(err);
        callback('Failed to get airplanes');
        return;
      }

      console.log(result)

      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Items)
      }
      callback(null, response);
    }
  )
}

module.exports.postAirplane = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'WheresBEFAAirplanesTable',
    Item: {
      tailNumber: data.tailNumber,
      ADSB: data.ADSB,
      latitude: data.latitude,
      longitude: data.longitude
    }
  }

  // put is an upsert
  dynamoDb.put(params,
    (err, result) => {
      if (err) {
        console.error(error);
        callback('Unable to create airplane');
        return;
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item)
      }

      // TODO: return revised/created object; only empty object is returned by put
      console.log(result)
      console.log(response)
      callback(null, response);
    }
  )
}
