OpenTrappUI
===========

Open Time Registration Application

## prerequisites

### Install Nodejs

[https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

### Install node modules (run in project directory)

    npm install -g grunt-cli # you might need root privilges
    npm install

### Run tests
    grunt

### Run local server
    grunt server

### Other available tasks

Run unit tests in 'single run' mode

    grunt karma:unit

Run unit tests in 'continuous run' mode with 'autoWatch'

    grunt karma:dev

Publish on Github on PROD

    grunt gh-pages:prod

