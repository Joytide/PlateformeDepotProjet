FROM node:14.15.4

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm update
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN mkdir -p /usr/src/app/.uploads
RUN chown node:node -R /usr/src/app/.uploads
RUN mkdir -p /usr/src/app/.exports
RUN chown node:node -R /usr/src/app/.exports

EXPOSE 3000
USER node
CMD [ "node", "--trace-warnings", "app.js" ]
