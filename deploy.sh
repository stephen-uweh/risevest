#!/bin/sh
set -e

echo "Deploying application ..."

docker build -t risevest-ms ./ 

docker compose up -d

echo "Application deployed!"
