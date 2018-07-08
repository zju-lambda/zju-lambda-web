FROM ubuntu:18.04

LABEL maintainer="nicekingwei@foxmail.com"

RUN apt update
RUN apt install -y nodejs npm
RUN npm install -g yarn