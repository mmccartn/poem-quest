FROM python:3.13-alpine

# Label metadata
LABEL maintainer="mattsmccartney@gmail.com"
LABEL version="0.1.0"
LABEL description="Elevator simulator Docker image"

# Working directory inside the container
WORKDIR /usr/src/app

COPY sim/main.py ./

ENTRYPOINT ["python", "./main.py"]

# Default container arguments run the example 3-person scenario from the sim README
CMD ["0", "5", "6", "0", "5", "4", "0", "9", "10"]
