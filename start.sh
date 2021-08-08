sudo docker build -t compiler .
sudo docker run --privileged -d -t -i -p 5050:5050 --name thebot-compiler --restart always compiler
