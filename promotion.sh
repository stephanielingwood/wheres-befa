apt-get update
apt-get install jq
npm install -g serverless -s

export OPEN_SKY_USERNAME=$(aws ssm get-parameters --names OPEN_SKY_USERNAME --with-decryption | jq '.Parameters | .[0] | .Value')
export OPEN_SKY_USERNAME=${OPEN_SKY_USERNAME//\"}
export OPEN_SKY_PASSWORD=$(aws ssm get-parameters --names OPEN_SKY_PASSWORD --with-decryption | jq '.Parameters | .[0] | .Value')
export OPEN_SKY_PASSWORD=${OPEN_SKY_PASSWORD//\"}

cd airplanes
npm install -s
serverless deploy -f getAll -s prod -r us-east-1 -v
serverless deploy -f post -s prod -r us-east-1 -v

cd ../airplanesCron
npm install -s
serverless deploy -f cron -s prod -r us-east-1 -v

