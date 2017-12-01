## Where's BEFA?

An app for a flying club who wants to know where their airplanes are.

This serverless app consists of an API for  airplane location data (stored in DynamoDB), and a cron service that retrieves ADS-B airplane tracking data from the [Open Sky Network](https://opensky-network.org/). It uses CodeBuild for CI/CD, and CodePipeline to manage deployments.

A GET call to [Where's BEFA](https://g1oy8k184e.execute-api.us-east-1.amazonaws.com/prod/airplanes) will return the last known location of an airplane, in this format:

```
[
    {
        "tailNumber": "N97PD",
        "ADSB": "ad8295",
        "latitude": 47.498,
        "longitude": -122.218
        "updatedAt": 1508262789735,
    }
]
```

Thanks to [Open Sky Network](https://opensky-network.org/) for providing the data, and managing their volunteer-based network of ADS-B receivers.
