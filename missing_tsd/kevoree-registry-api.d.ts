declare module "kevoree-registry-api" {
    module e {
        export function auth(user: any):Q.Promise<any>;
        export const config: { host: string, port: number };
        export function whoami(identity:string): string;
        export function createTdef(token: string, namespace: string, name: string, version: string , data: string): void;
        export function deleteTdef(token: string, namespace: string, name: string, version: string): void;
        export function getTdefs(namespace: string, name: string, version: number):any;
        export function getDeployUnits(namespace: string, name: string, version: number, platform: string, latest: boolean):any;
        export function isConnected(token:string): Q.Promise<boolean>;
    }
    export = e;
}