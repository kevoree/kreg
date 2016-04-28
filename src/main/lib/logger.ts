// Created by leiko on 13/02/15 11:26
import * as winston from "winston";

winston.loggers.add('console', {
    console: {
        level: 'info',
        colorize: true,
        prettyPrint: true
    }
});

export function updateLogLevel(level: string) {
    const transport: any = logger.transports;
    switch (level) {
        case "info":
            transport.console.level = 'info';
            break;

        case "debug":
            transport.console.level = 'debug';
            break;

        case "warn":
            transport.console.level = 'warn';
            break;

        case "error":
            transport.console.level = 'error';
            break;

        case "silly":
            transport.console.level = 'silly';
            break;

        default:
            logger.warn('Unknown log level "%s", defaulting to "info"', level);
    }
}

export const logger = winston.loggers.get('console');

