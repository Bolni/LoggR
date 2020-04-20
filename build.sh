docker build -t loggr .
docker container run -d -p 5000:5000 --name loggr -v $(pwd):/opt/loggR -v /var/log/syslog:/var/log/syslog --net="host" loggr