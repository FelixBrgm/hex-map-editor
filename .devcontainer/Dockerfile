# Base image
FROM ubuntu:22.04

# Install necessary dependencies for Node.js and Rust
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y build-essential && \
    apt-get install -y netcat && \
    apt-get install -y libpq-dev && \
    apt-get install -y git && \
    apt-get install -y pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Install Vue CLI
RUN npm install -g @angular/cli


# Expose Ports
EXPOSE 4242
EXPOSE 8080

# Setting working directory
WORKDIR /usr/src

# Mounting the volume to the docker container
VOLUME [ "/usr/src" ]

CMD ["tail", "-f", "/dev/null"]
