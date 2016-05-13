import * as Registry  from 'kevoree-registry-api';
import { logger } from "../lib/logger";

export const searchDeployUnitAction = function (namespace: string, name: string, version: string, platform: string, options: {model: string, latest: boolean}) {
    logger.debug(namespace);

    const pNamespace = (namespace === "*") ? "**" : namespace;
    const pName = (name === "*") ? "**" : name;
    const pPlatform = (platform === '*') ? "**" : platform;
    const pLatest = (options || {latest: false}).latest;

    Registry.getDeployUnits(pNamespace, pName, parseInt(version, 10), pPlatform, pLatest)
        .then(function (tdefs: Array<any>) {
            if (tdefs.length === 0) {
                logger.info('No Deploy Unit found that matches %s', namespace + (name?'.'+name:'') + (version?'/'+version:'') + (platform?(" platform = " + platform):''));
            } else {
                if (options.model) {
                    logger.info('Results (', tdefs.length ,') :', tdefs.map(function (tdef) {
                        tdef.serializedModel = JSON.parse(tdef.serializedModel);
                        return tdef;
                    }));
                } else {
                    logger.info('Results (', tdefs.length ,') :', tdefs.map(function (tdef) {
                        delete tdef.serializedModel;
                        return tdef;
                    }));
                }
            }
        })
        .catch(function (err: {message: string}) {
            logger.error('Something went wrong (reason: %s)', err.message);
        })
        .done();

}