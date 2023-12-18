# NodeJS-React-MongoDB-starter

Depreciated in favor of separated starter repos.

## Adding a new service

- Add a new service by creating a new directory under `services/`. This directory should include a Tiltfile which builds and deploys k8s resources needed by the service.
- Include this in the top level `Tiltfile`.

## System command

- deploy with `./system up`
- teardown with `./system down`
- clear all Docker data with `./system pruneall`

## Dependencies

- [kind](https://kind.sigs.k8s.io/)
- [ctlptl](https://github.com/tilt-dev/ctlptl)
- [Docker](https://docs.docker.com/get-docker/)
- [Tilt](https://tilt.dev/)
