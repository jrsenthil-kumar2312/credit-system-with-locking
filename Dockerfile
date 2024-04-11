FROM node:16

# Create app directory
# Copy files as a non-root user. The `node` user is built in the Node image.
WORKDIR .
# RUN chown node:node ./
# USER node

ARG NODE_ENV=dev
ENV NODE_ENV $NODE_ENV

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm i -g nodemon
RUN npm i mocha
RUN npm i sequelize-cli
RUN npm ci && npm cache clean --force

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
