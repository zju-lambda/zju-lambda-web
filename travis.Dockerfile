FROM nicekingwei/zju-lambda-web

LABEL maintainer="nicekingwei@foxmail.com"

RUN git clone https://github.com/zju-lambda/Ghost.git ~/Ghost
RUN cd ~/Ghost/ && yarn setup
RUN apt install -y wget curl iputils-ping
