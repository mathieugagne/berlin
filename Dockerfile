ARG DOCKER_IMAGE
FROM $DOCKER_IMAGE

ARG BUNDLER_VERSION
ARG USER_UID
ARG USER_GID

# Setup an unprivileged user to fix docker host filesystem permissions
RUN useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m dev

# Create a directory for the app code
RUN mkdir -p /app
WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    build-essential \
    # nokogori for rails_admin (and maybe puma)
    pkg-config libxml2-dev libxslt-dev \
    patch ruby-dev zlib1g-dev liblzma-dev  \
    # assets compilation
    nodejs

# RUN gem install nokogiri:1.6.0 --platform=ruby -- --use-system-libraries

# COPY Gemfile* ./
# RUN gem install bundler -v $BUNDLER_VERSION && bundle _${BUNDLER_VERSION}_ install
# RUN gem install --default bundler -v ${BUNDLER_VERSION}
# RUN gem uninstall bundler:2.1.4

# Upgrade RubyGems, install required Bundler version & set user permissions
# RUN gem update --system && \
  # gem uninstall bundler && \
  # Removes incompatible pre-installed default version of bundler
  # rm /usr/local/lib/ruby/gems/2.7.0/specifications/default/bundler-2.4.13.gemspec && \
  # gem install bundler -v $BUNDLER_VERSION --default && \
RUN chown -R $USER_UID:$USER_GID /usr/local/bundle/

