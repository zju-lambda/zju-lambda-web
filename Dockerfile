FROM ubuntu:16.04

MAINTAINER nicekingwei nicekingwei@foxmail.com

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt install -y nodejs npm