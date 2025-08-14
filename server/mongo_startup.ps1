$ErrorActionPreference="Stop"
# Make sure docker in your system path

Write-Output 'Create docker volume ...'
docker volume create mongo_volume3 

Write-Output 'Extract db to volume ...'
docker run --rm -v mongo_volume3:/data1 -v ${pwd}/mongo_volume:/data2 busybox sh -c 'cd data1 && tar xvfz /data2/dataset.tar.gz --strip 2'

Write-Output 'Start up mongodb server attaching volume ...'
docker run --rm -v mongo_volume3:/data/db -p 27018:27017 --name mongodb3 -d mongo
Write-Output 'Mongo is ready ...'
