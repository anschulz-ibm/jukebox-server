# pull the Node.js Docker image
FROM node:alpine

ENV NODE_ENV=development
ENV VOLUMIO_HOST=192.168.178.79
ENV PORT=3002

RUN npm install -g nodemon

# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

EXPOSE ${PORT}

# the command that starts our app
CMD [ "npm", "start" ]