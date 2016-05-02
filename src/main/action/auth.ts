import * as inquirer from "inquirer";
import * as Registry  from 'kevoree-registry-api';
import { logger } from "../lib/logger";
import * as nconf from "nconf";

export const authAction = function () {
    inquirer.prompt([
        {type: 'input', name: 'username', message: 'Login'},
        {type: 'password', name: 'password', message: 'Password'}
    ], function (user) {
        Registry.auth(user)
            .then(function (credentials:{ token_type:any, scope:any, expiresAt:number, expires_in:string }) {
                try {
                    //delete credentials.token_type;
                    //delete credentials.scope;
                    //credentials.expiresAt = Math.round(new Date().getTime() / 1000) + parseInt(credentials.expires_in);
                    //delete credentials.expires_in;
                    nconf.set('auth', credentials);
                    nconf.save(function (err:any) {
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
            .catch(function (err:{message:string}) {
                logger.error('Unable to proceed authentication with %s:%s (reason: %s)',
                    Registry.config.host, Registry.config.port, err.message);
            })
            .done();
    });
};