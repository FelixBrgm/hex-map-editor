# Base image
FROM node:20-bullseye-slim

# Install necessary dependencies for Node.js and Rust
RUN apt-get update 
RUN apt-get install -y git 

# Install Angular CLI
RUN npm install -g @angular/cli

# Expose Ports
EXPOSE 4242
EXPOSE 8080

# Setting working directory
WORKDIR /usr/src

# Mounting the volume to the docker container
VOLUME [ "/usr/src" ]

CMD ["tail", "-f", "/dev/null"]
