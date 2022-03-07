# NodeJS-React-MongoDB-starter

Boilerplate code for starter website

## Testing Environment

1. Install [Docker](https://docs.docker.com/)
2. Run `./scripts/run_locally` to build and run the app on `localhost:8080`. You'll need to run this everytime you make changes to the app.

## First Time Setup

1. Update website title and background color in `frontend/public/index.html`.
2. Use a favicon generator to generate favicon files (ex. with `https://realfavicongenerator.net/`). Add the files to `frontend/public` and the favicon html headers to `frontend/public/index.html`.
3. Update the `name`, `description` and github links in `package.json`
4. Select HTTP / HTTPS option, port, and domain name in `./scripts/config`.

## Deployment

### Manually Deploy on Ubuntu Server

1. Create server using Infrastructure as a Service provider such as [Vultr](https://vultr.com/). Log in using SSH.
1. Copy and paste `./scripts/manual_deploy/init` into the terminal. Add key to GitHub as directed.
1. Clone the GitHub repo.
1. Run `./scripts/manual_deploy/deploy` to deploy. Run `./scripts/manual_deploy/update` to update.

### Deploy on Kubernetes Engine

TODO
