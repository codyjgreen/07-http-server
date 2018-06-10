'use strict';

const server = require('./lib/server.js').server;

const PORT = process.ENV || 3000;
server.start(PORT);
