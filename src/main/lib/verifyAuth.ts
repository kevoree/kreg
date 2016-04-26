// Created by leiko on 18/02/15 10:39
import * as Q from "q";
import * as Registry  from 'kevoree-registry-api';

/**
 * Verify if expiresAt is not expired, tries to refresh token otherwise
 * @param {Object} auth
 * @returns {Q.Promise}
 */
export function verifyAuth(auth: { expiresAt: any, refresh_token: any }): Q.Promise<any> {
    return Q.Promise(function (resolve: () => any, reject: any) {
        try {
            if (typeof auth.expiresAt === 'number') {
                var expireDate = new Date(auth.expiresAt * 1000);
                var currentDate = new Date();
                if (currentDate.getTime() >= expireDate.getTime()) {
                    // token expired: ask for another one
                    Registry.refresh()
                        .then(resolve)
                        .catch(reject)
                        .done();
                } else {
                    resolve();
                }
            } else {
                // expiresAt seems broke, try to refresh, just in case
                if (typeof auth.refresh_token === 'string') {
                    Registry.refresh()
                        .then(resolve)
                        .catch(reject)
                        .done();
                } else {
                    reject(new Error('Unable to authenticate you. You should run "kreg auth"'));
                }
            }
        } catch (err) {
            reject(new Error('Unable to authenticate you. You should run "kreg auth"'));
        }
    });
}