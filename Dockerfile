# Base image
FROM ubuntu:16.04


# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV NVM_DIR /usr/local/nvm

RUN mkdir -p $NVM_DIR


RUN apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests -y ca-certificates \
    nginx -y net-tools curl wget bzip2 unzip \
    sudo ffmpeg build-essential libssl-dev

  

# install nodejs

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y

ENV NVM_VERSION=0.39.1
ENV NODE_VERSION=16.17.1

WORKDIR $NVM_DIR

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install ZLIB_1.2.9
WORKDIR /usr/src
RUN wget https://www.zlib.net/fossils/zlib-1.2.9.tar.gz && tar -xzvf zlib-1.2.9.tar.gz
WORKDIR /usr/src/zlib-1.2.9
RUN ./configure && make && make install

    
RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app


# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /usr/src/app/

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN node -v && ls && npm install --force --legacy-peer-deps

# Creates a "dist" folder with the production build
RUN npm run build

ENV PORT 3000
EXPOSE $PORT


# Start the server using the production build
CMD [ "node", "dist/main.js" ]

