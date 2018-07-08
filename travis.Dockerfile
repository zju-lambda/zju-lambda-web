FROM ubuntu:18.04

LABEL maintainer="nicekingwei@foxmail.com"

RUN apt update
RUN apt install -y nodejs npm git
RUN npm install -g yarn
RUN git clone https://github.com/zju-lambda/Ghost.git ~
RUN yarn global add knex-migrator grunt-cli ember-cli bower
RUN cd ~/Ghost/ && yarn setup