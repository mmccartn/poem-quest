Elevate Poet Contain
====================

Parent repository for several coding examples.
- [gui](./gui) contains an Angular application to interface with the https://poetrydb.org/
- [sim](./sim) contains a Python script to simulate an elevator
- [Dockerfile](./Dockerfile) containerizes the simulator using Docker

The rest of this README describes how to use the top-level Dockerfile to run the elevator sim.

Requirements
------------
- [Docker](https://www.docker.com/)

Build the Docker Image
----------------------
```bash
docker build -t elevator-sim:v0.1.0 .
```

Run the Docker Container
------------------------

The following 3 examples show how to run the elevator simulator container.

### Default Scenario
```bash
docker run elevator-sim:v0.1.0
```

### Custom Scenario
```bash
# Two passengers:
#   P0 arrives at t=0, at floor 1, going to 5
#   P1 arrives at t=3, at floor 2, going to 7
docker run elevator-sim:v0.1.0 0 1 5 3 2 7
```

### Usage
```bash
docker run elevator-sim:v0.1.0 -h
```

License
-------
MIT
