apt-get install jq
npm install -g serverless

export OPEN_SKY_PASSWORD=$(aws ssm get-parameters --names OPEN_SKY_PASSWORD --with-decryption | jq '.Parameters | .[0] | .Value')

cd airplanes
npm install
serverless deploy -f getAll -s prod -r us-east-1 -v
serverless deploy -f post -s prod -r us-east-1 -v

cd ../airplanesCron
npm install
serverless deploy -f cron -s prod -r us-east-1 -v

