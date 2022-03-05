# NodeJS-React-MongoDB-starter

Boilerplate code for starter website

## Testing Environment

1. Install [Docker](https://docs.docker.com/)
2. From the main directory, run `npm i` to install dependencies.
3. Run `docker build --build-arg mode=dev --tag server-image .` to build the container image. For debugging, edit the Dockerfile to use `npm run build-debug`. You'll need to run this everytime you make changes to the app.
4. Run `docker run -d -p 8080:8080 --name server server-image` to start the server on `localhost:8080`.

## First Time Setup

1. Update website title and background color in `frontend/public/index.html`.
2. Use a favicon generator to generate favicon files (ex. with `https://realfavicongenerator.net/`). Add the files to `frontend/public` and the favicon html headers to `frontend/public/index.html`.
3. Update the `name`, `description` and github links in `package.json`
