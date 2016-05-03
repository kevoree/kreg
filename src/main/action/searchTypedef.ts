import * as Registry  from 'kevoree-registry-api';
import { logger } from "../lib/logger";

export const searchTypedefAction = function (namespace: string, name: string, version: string, options: {model: string}) {
    logger.debug(namespace);


    const pNamespace = (namespace === "*") ? "**" : namespace;
    const pName = (name === "*") ? "**" : name;
    
    Registry.getTdefs(pNamespace, pName, parseInt(version, 10) )
        .then(function (tdefs: Array<any>) {
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
        .catch(function (err: {message: string}) {
            logger.error('Something went wrong (reason: %s)', err.message);
        })
        .done();

};