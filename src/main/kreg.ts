#!/usr/bin/env node

import * as commander from "commander";
import * as path from "path";
import { logger, updateLogLevel } from "./lib/logger";
import * as nconf from "nconf";
import * as pkg from "../package.json";
import * as Registry  from 'kevoree-registry-api';
import {authAction, publishAction, searchTypedefAction, searchDeployUnitAction, whoamiAction} from "./action";

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
    .action(authAction);

commander
    .command('whoami')
    .description('Prints currently authenticated username')
    .action(whoamiAction);

commander
    .command('publish <namespace> <name> <version> <modelPath>')
    .description('Publish a new TypeDefinition on the registry')
    .action(publishAction);

commander
    .command('search-typedef <namespace> [typedef] [version]')
    .option('-m, --model', 'Show serialized model')
    .description('Prints information about TypeDefinitions')
    .action(searchTypedefAction);

commander
    .command('search-deploy-unit <namespace> [typedef] [version] [platform]')
    .option("--latest", "Shows only latest Deploy Units of every Type Definitions.")
    .option('-m, --model', 'Show serialized model')
    .description('Prints information about DeployUnits')
    .action(searchDeployUnitAction);

nconf.load(function () {
    commander.parse(process.argv);

    if (!commander.args.length) {
        commander.outputHelp();
    }
});

function updateConfig(key: string) {
    return function (value: any) {
        Registry.config[key] = value;
    };
}
