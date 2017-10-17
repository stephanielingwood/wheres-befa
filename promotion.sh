npm install -g serverless

cd airplanes
npm install
serverless deploy -f getAll -s prod -r us-east-1 -v
serverless deploy -f post -s prod -r us-east-1 -v

cd ../airplanesCron
npm install
serverless deploy -f cron -s prod -r us-east-1 -v
