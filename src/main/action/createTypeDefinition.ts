import * as Registry  from 'kevoree-registry-api';
import { logger } from "../lib/logger";
import * as nconf from "nconf";

export function createTypeDefinition(namespace: string, name: string, version: number, serializedModel: string) {
    const id_token:string = nconf.get('auth:id_token');

    Registry.createTypeDef(id_token, namespace, name, version, serializedModel)
        .then(function (result: any) {
            logger.info("type definition created");
        })
        .catch(function (err: {message: string, fieldErrors: Array<{objectName: string, message: string}>}) {
            logger.error('Something went wrong (reason: %s)', err.message);
            (err.fieldErrors || []).map((item) => {
                if(item.objectName && item.message) {
                    logger.error(" - %s : %s", item.objectName, item.message);
                }
            });
        })
        .done();
}