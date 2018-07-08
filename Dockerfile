FROM ubuntu:18.04

RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic main restricted" > /etc/apt/sources.list
RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic-updates main restricted" >> /etc/apt/sources.list
RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic universe" >> /etc/apt/sources.list
RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic-updates universe" >> /etc/apt/sources.list
RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic multiverse" >> /etc/apt/sources.list
RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic-updates multiverse" >> /etc/apt/sources.list
RUN echo "deb http://mirrors.zju.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse" >> /etc/apt/sources.list
RUN echo "deb http://security.ubuntu.com/ubuntu bionic-security main restricted" >> /etc/apt/sources.list
RUN echo "deb http://security.ubuntu.com/ubuntu bionic-security universe" >> /etc/apt/sources.list
RUN echo "deb http://security.ubuntu.com/ubuntu bionic-security multiverse" >> /etc/apt/sources.list
RUN apt update
RUN apt install -y nodejs npm

LABEL maintainer="nicekingwei@foxmail.com"