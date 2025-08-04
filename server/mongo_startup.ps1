# before run this make sure, no port on your host is using 27017
Write-Output 'Start up mongodb container'

Write-Output 'Create docker volume ...'
docker volume create mongo_volume2

Write-Output 'Extract db to volume ...'
docker run --rm -v mongo_volume2:/data1 -v ${pwd}/mongo_volume:/data2 busybox sh -c 'cd data1 && rm -rf ./* && tar xvfz /data2/backup.tar.gz --strip 2'

Write-Output 'Start up mongodb server attaching volume ...'
docker run --rm -v mongo_volume2:/data/db -p 27017:27017 --name mongo_server -d mongo
Write-Output 'Mongo is ready ...'
