# Installation:

## Environment Variables

```
// deployment environment
NODE_ENV=development
// this should point to the volumio RPi (most likely localhost)
VOLUMIO_HOST=192.168.178.79
// the path in the Volumio media library to the music
VOLUMIO_FOLDER=USB/SWITCH_SD
// the port the API is reachable from
PORT=3002
```

## NodeJS
### Install NodeJS
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

nvm install 8.11

npm install
```

### Start
First rename **"default.env"** to **".env"** and change the content to the correct environment values (see above). Then run:
```
npm start
```

## Docker
```
docker build . -t self/jukebox-server
docker run -e VOLUMIO_HOST=<Volumio-Server-IP> -e VOLUMIO_FOLDER="<Path-To-Media-In-Volumio>" -p 3002:3002 -v "./src:/usr/src/app/src" self/jukebox-server
```

# API
## View Votes
```
GET http://localhost:<PORT>/api/vote
```
## Cast Vote
```
POST http://localhost:<PORT>/api/vote/cast {"song":<song_index>}
```
song_index = Index of the song from **View Votes**