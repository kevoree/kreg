#!/usr/bin/env node

import * as commander from "commander";
import * as inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";
import * as logger from "./lib/logger";
import * as verifyAuth from "./lib/verifyAuth";
import * as nconf from "nconf";
import * as pkg from "../../../package.json";

var Registry  = require('kevoree-registry-api');

var HOME_DIR = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var KREGRC_PATH = path.resolve(HOME_DIR, '.kregrc');

logger.cli();
nconf.file({ file: KREGRC_PATH });

commander
    .version(pkg.version)
    .option('--host <host>', 'Kevoree Registry hostname', updateConfig('host'))
    .option('--port <port>', 'Kevoree Registry port', updateConfig('port'))
    .option('-l, --logLevel <level>', 'Logging level, defaults to "info"', updateLogLevel);

commander
    .command('auth')
    .description('Authenticate using a registry user account')
    .action(function () {
        inquirer.prompt([
            { type: 'input', name: 'username', message: 'Login' },
            { type: 'password', name: 'password', message: 'Password' }
        ], function (user) {
            Registry.auth(user)
                .then(function (credentials) {
                    try {
                        delete credentials.token_type;
                        delete credentials.scope;
                        credentials.expiresAt = Math.round(new Date().getTime() / 1000) + parseInt(credentials.expires_in);
                        delete credentials.expires_in;
                        nconf.set('auth', credentials);
                        nconf.save(function (err) {
                            if (err) {
                                throw err;
                            } else {
                                logger.info('You are now authenticated to %s:%s', Registry.config.host, Registry.config.port);
                            }
                        });
                    } catch (err) {
                        throw new Error('Bad credentials response');
                    }
                })
                .catch(function (err) {
                    logger.error('Unable to proceed authentication with %s:%s (reason: %s)',
                        Registry.config.host, Registry.config.port, err.message);
                })
                .done();
        });
    });

commander
    .command('whoami')
    .description('Prints currently authenticated username')
    .action(function () {
        verifyAuth(nconf.get('auth'))
            .then(function () {
                return Registry.whoami(nconf.get('auth:access_token'));
            })
            .then(function (username) {
                logger.info('Authenticated as "%s"', username);
            })
            .catch(function () {
                logger.error('Unable to authenticate you. You should run "kreg auth"');
            })
            .done();
    });

commander
    .command('publish <namespace> <name> <version> <modelPath>')
    .description('Publish a new TypeDefinition on the registry')
    .action(function (namespace, name, version, modelPath) {
        fs.readFile(modelPath, 'utf8', function (err, data) {
            if (err) {
                logger.error('Unable to read model file at location "%s" (reason: %s)', modelPath, err.message);
            } else {
                logger.info('Trying to publish %s.%s/%s (%s) to %s:%s', namespace, name, version, modelPath, Registry.config.host, Registry.config.port);
                logger.info('Please wait...');

                verifyAuth(nconf.get('auth'))
                    .then(function () {
                        return Registry.createTdef(nconf.get('auth:access_token'), namespace, name, version, data);
                    })
                    .then(function () {
                        logger.info('Success.');
                    })
                    .catch(function (err) {
                        logger.error(err.message);
                    })
                    .done();
            }
        });
    });

commander
    .command('unpublish <namespace> <name> [version]')
    .option('-f, --force', 'Do not ask for confirmation')
    .description('Unpublish a TypeDefinition from the registry')
    .action(function (namespace, name, version, options) {
        function doDelete() {
            logger.info('Trying to unpublish %s.%s/%s from %s:%s', namespace, name, version, Registry.config.host, Registry.config.port);
            logger.info('Please wait...');

            verifyAuth(nconf.get('auth'))
                .then(function () {
                    return Registry.deleteTdef(nconf.get('auth:access_token'), namespace, name, version);
                })
                .then(function () {
                    logger.info('Unpublished.');
                })
                .catch(function (err) {
                    logger.error(err.message);
                })
                .done();
        }

        if (options.force) {
            doDelete()
        } else {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'doDelete',
                    default: false,
                    message: 'Are you sure you want to delete ' + namespace + '.' + name + (version ? '/' + version : '')
                }
            ], function (answer) {
                if (answer.doDelete) {
                    doDelete();
                }
            });
        }
    });

commander
    .command('get <namespace> [name] [version]')
    .option('-m, --model', 'Show serialized model')
    .description('Prints information about Namespaces and TypeDefinitions')
    .action(function (namespace, name, version, options) {
        Registry.getTdefs(namespace, name, version)
            .then(function (tdefs) {
                if (tdefs.length === 0) {
                    logger.info('No TypeDefinition found that matches %s', namespace + (name?'.'+name:'') + (version?'/'+version:''));
                } else {
                    if (options.model) {
                        logger.info('Results:', tdefs.map(function (tdef) {
                            tdef.serializedModel = JSON.parse(tdef.serializedModel);
                            return tdef;
                        }));
                    } else {
                        logger.info('Results:', tdefs.map(function (tdef) {
                            delete tdef.serializedModel;
                            return tdef;
                        }));
                    }
                }
            })
            .catch(function (err) {
                logger.error('Something went wrong (reason: %s)', err.message);
            })
            .done();

    });

nconf.load(function () {
    commander.parse(process.argv);

    if (!commander.args.length) {
        commander.outputHelp();
    }
});

function updateConfig(key) {
    return function (value) {
        Registry.config[key] = value;
    };
}

function updateLogLevel(level) {
    switch (level) {
        default:
            logger.warn('Unknown log level "%s", defaulting to "info"', level);
        case 'info':
            logger.transports.console.level = 'info';
            break;

        case 'debug':
            logger.transports.console.level = 'debug';
            break;

        case 'warn':
            logger.transports.console.level = 'warn';
            break;

        case 'error':
            logger.transports.console.level = 'error';
            break;

        case 'silly':
            logger.transports.console.level = 'silly';
            break;
    }
}
