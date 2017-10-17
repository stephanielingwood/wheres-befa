npm install -g serverless

cd airplanes
serverless deploy -f getAll -s prod -r us-east-1 -v
serverless deploy -f post -s prod -r us-east-1 -v

cd ../airplanesCron
serverless deploy -f cron -s prod -r us-east-1 -v
