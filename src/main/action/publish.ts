import { logger } from "../lib/logger";
import * as fs from "fs";
import { verifyAuth } from "../lib/verifyAuth";
import * as nconf from "nconf";
import * as Registry  from 'kevoree-registry-api';

export const publishAction = function (namespace: string, name: string, version: string, modelPath: string) {
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
};