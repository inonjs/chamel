FROM node:6

WORKDIR /var/www/app

# Copy over source
COPY ./ .

# Clean out node_modules in case this is beng run on a dev box
RUN rm -rf node_modules/*
RUN rm -rf build/*

# Install dependencies for the library
EXPOSE 8081
EXPOSE 885
EXPOSE 3001

# Run the server
CMD rm -rf node_modules/* && npm start