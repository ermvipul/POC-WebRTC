# Use the official Ubuntu base image
FROM ubuntu:latest

# Set the maintainer label
LABEL maintainer="vipul@itsabacus.com"

# Set environment variables to avoid user prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and npm
RUN apt update && apt install -y nodejs npm

# Update the package list and install some basic packages
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

EXPOSE 9977

# Run a command (for example, you can use /bin/bash to start an interactive shell)
CMD ["/app/start.sh"]
