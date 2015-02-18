// Created by leiko on 13/02/15 11:26
var winston = require('winston');

winston.loggers.add('console', {
    console: {
        level: 'info',
        colorize: true,
        prettyPrint: true
    }
});

module.exports = winston.loggers.get('console');