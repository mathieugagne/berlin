FROM ruby:1.9-wheezy

ARG USER_UID
ARG USER_GID

# Setup an unprivileged user to fix docker host filesystem permissions
RUN useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m dev

# Create a directory for the app code
RUN mkdir -p /app
WORKDIR /app

RUN chown -R $USER_UID:$USER_GID /usr/local/bundle/
