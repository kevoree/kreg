import { logger } from "../lib/logger";
import { verifyAuth } from "../lib/verifyAuth";
import * as nconf from "nconf";
import * as Registry  from 'kevoree-registry-api';

export const whoamiAction = function () {
    verifyAuth(nconf.get('auth'))
        .then(function () {
            const id_token:string = nconf.get('auth:id_token');
            logger.debug("id_token = " + id_token);
            return Registry.whoami(id_token);
        })
        .then(function (username: string) {
            logger.info('Authenticated as "%s"', username);
        })
        .catch(function (err) {
            if(err) {
                logger.error("Error : " + err);
            }
        })
        .done();
};