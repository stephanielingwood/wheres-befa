'use strict';

const _ = require('underscore');

class Airplanes {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  getAll(callback) {
    const params = {
      TableName: this.tableName
    };

    this.db.scan(params,
      (err, result) => {
        if (err) {
          console.error(err);
          callback(`Failed to get all airplanes: ${err}`);
          return;
        }

        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Items)
        };
        callback(null, response);
      }
    );
  }

  post(body, callback) {
    const timestamp = new Date().getTime();
    const params = {
      TableName: this.tableName,
      Item: {
        tailNumber: body.tailNumber,
        ADSB: body.ADSB,
        latitude: body.latitude,
        longitude: body.longitude,
        updatedAt: timestamp
      }
    };

    this.db.put(params,
      (err, result) => {
        if (err) {
          console.error(err);
          callback(`Unable to create or update airplane: ${err}`);
          return;
        }

        this.getAll((err, data) => {
          const parsedData = JSON.parse(data.body);
          const updatedAirplane = _.findWhere(parsedData, {tailNumber: params.Item.tailNumber});

          const response = {
            statusCode: 200,
            body: JSON.stringify(updatedAirplane)
          };

          callback(null, response);
        });
      }
    );
  }
}

module.exports = Airplanes;
