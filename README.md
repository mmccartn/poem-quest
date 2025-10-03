PoemQuest
=========
A website to query the https://poetrydb.org/, adapted from the Angular [first-app](https://angular.dev/tutorials/first-app) and [signals](https://angular.dev/tutorials/signals) tutorials.

Requirements
------------
- [NodeJS](https://nodejs.org/) v20+

Installation
------------
`npm install`

Development
-----------
1. Compile and host locally: `npm run start`
2. Navigate to GUI at: [http://localhost:4200/](http://localhost:4200/)

Deploy
------

This repository includes a Dockerfile to build and run this website in a Docker container.
After installing [Docker](https://www.docker.com/), run the following commands...

**To build the Docker image:**
```bash
docker build --tag poem-quest:v0.2.0 .
```

**To host the website at [http://localhost:4200](http://localhost:4200)**
```bash
docker run --publish 4200:80 --tty poem-quest:v0.2.0
```


Example
-------
![gui-example](media/gui-example.jpg)

License
-------
MIT
