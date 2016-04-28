// Created by leiko on 18/02/15 10:39
import * as Q from "q";
import * as Registry  from 'kevoree-registry-api';

/**
 * Verify if expiresAt is not expired, tries to refresh token otherwise
 * @param {Object} auth
 * @returns {Q.Promise}
 */
export function verifyAuth(auth: { id_token: string}): Q.Promise<any> {
    return Registry.isConnected(auth.id_token);
}