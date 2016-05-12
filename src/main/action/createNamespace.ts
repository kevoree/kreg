/**
 * Created by mleduc on 12/05/16.
 */
import * as Registry  from 'kevoree-registry-api';
import { logger } from "../lib/logger";
import * as nconf from "nconf";

export function createNamespace(namespace: string) {
    const id_token:string = nconf.get('auth:id_token');

    Registry.createNamespace(id_token, namespace)
        .then(function (result: any) {
            logger.info("namespace created");
        })
        .catch(function (err: {message: string}) {
            logger.error('Something went wrong (reason: %s)', err.message);
        })
        .done();
}