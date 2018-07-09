FROM nicekingwei/zju-lambda-web

LABEL maintainer="nicekingwei@foxmail.com"

RUN rm -rf ~/
RUN git clone https://github.com/zju-lambda/Ghost.git ~/Ghost
RUN yarn global add knex-migrator grunt-cli ember-cli bower
RUN cd ~/Ghost/ && yarn setup