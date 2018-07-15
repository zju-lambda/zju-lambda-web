FROM gcc

LABEL maintainer="volltin@live.com"

RUN apt update

RUN curl -sSL https://get.haskellstack.org/ | sh
RUN mkdir ~/.stack
RUN /usr/local/bin/stack setup
RUN /usr/local/bin/stack path

RUN cd /tmp && git clone http://www.github.com/nicekingwei/steak && cd steak && /usr/local/bin/stack install
ENV PATH /root/.local/bin:$PATH
RUN apt install -y --no-install-recommends coq openjdk-8-jdk
RUN apt install -y --no-install-recommends unzip
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt install -y --no-install-recommends lua5.2
RUN wget -c https://downloads.lightbend.com/scala/2.12.4/scala-2.12.4.deb && dpkg -i scala-2.12.4.deb && rm -f scala*
RUN apt install -y --no-install-recommends nodejs
RUN /usr/local/bin/stack install idris --dependencies-only
RUN /usr/local/bin/stack install idris
RUN /usr/local/bin/stack install Agda --dependencies-only
RUN apt install -y --no-install-recommends agda
RUN mkdir /usr/include/steak && cp /tmp/steak/include/steak.h /usr/include/steak && cp /tmp/steak/include/runtime.h /usr/include/steak
RUN useradd -s /bin/bash -m -p NautyCoder code
RUN apt update
RUN apt install -y --no-install-recommends racket
