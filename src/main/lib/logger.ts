// Created by leiko on 13/02/15 11:26
import * as winston from "winston";

winston.loggers.add('console', {
    console: {
        level: 'info',
        colorize: true,
        prettyPrint: true
    }
});

export = winston.loggers.get('console');