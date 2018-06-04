#!/bin/bash
sudo docker ps --all | grep htmlcontroller | awk {'print $1}' | xargs sudo docker rm -f
sudo docker build --no-cache -t patriciochavez/htmlcontroller .
sudo docker run -p 80:80 -d --name htmlcontroller patriciochavez/htmlcontroller
